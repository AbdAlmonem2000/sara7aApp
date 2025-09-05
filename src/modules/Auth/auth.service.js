// src/modules/Auth/auth.service.js

import { create, findOne, findOneAndUpdate, updateOne } from "../../DB/dbService.js";
import { provider, role, userModel } from "../../DB/models/user.model.js";
import { encrypt } from "../../utils/encryption/encryption.utils.js";
import { compare, hash } from "../../utils/hashing/hash.utils.js";
import { successResponse } from "../../utils/successResponse.utils.js";
import { getNewLogInCredentials, getSignature, signatureEnum, signToken } from "../../utils/token/token.utils.js";
import { OAuth2Client } from "google-auth-library";
import { emailEvent } from "../../utils/events/event.utils.js";
import { customAlphabet } from "nanoid";
import { tokenModel } from "../../DB/models/token.model.js";

// ----------------- Sign Up -----------------
export const signUp = async (req, res, next) => {
    const { firstName, lastName, email, password, phone, gender, role } = req.body;

    if (await findOne({ module: userModel, filter: { email } }))
        return next(new Error("Email already exists", { cause: 409 }));

    const hashedPassword = await hash({ plainText: password });
    const encryptedPhone = encrypt(phone);

    const code = customAlphabet("0123456789", 6)();
    const hashOtp = await hash({ plainText: code });

    emailEvent.emit("confirmEmail", { to: email, otp: code, firstName });

    const user = await create({
        module: userModel,
        data: [
            {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone: encryptedPhone,
                gender,
                role,
                confirmEmailOtp: hashOtp,
            },
        ],
    });

    return successResponse({
        res,
        statusCode: 201,
        message: "user created successfully",
        data: user,
    });
};

// ----------------- Log In -----------------
export const logIn = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await findOne({ module: userModel, filter: { email } });

    if (!user) return next(new Error("user not found", { cause: 404 }));

    if (!(await compare({ plainText: password, hash: user.password })))
        return next(new Error("invalid password", { cause: 401 }));

    const newCredentials = await getNewLogInCredentials(user);

    return successResponse({
        res,
        statusCode: 200,
        message: "user logged successfully",
        data: { newCredentials },
    });
};


export const logOut = async (req, res, next) => {

    await create({
        module: tokenModel,
        data: [{
            jti: req.decoded.jti,
            userId: req.user._id,
            expiresIn: Date.now() - req.decoded.exp,
        }]

    });

    successResponse({
        res,
        statusCode: 200,
        message: "logged out successfully",
    })

};

// ----------------- Confirm Email -----------------
export const confirmEmail = async (req, res, next) => {
    const { otp, email } = req.body;

    const user = await findOne({
        module: userModel,
        filter: {
            email,
            confirmEmail: { $exists: false },
            confirmEmailOtp: { $exists: true },
        },
    });

    if (!user)
        return next(new Error("user not found or email already confirmed", { cause: 404 }));

    if (!(await compare({ plainText: otp, hash: user.confirmEmailOtp })))
        return next(new Error("invalid otp", { cause: 401 }));

    await updateOne({
        module: userModel,
        filter: { email },
        data: {
            confirmEmail: Date.now(),
            $unset: { confirmEmailOtp: true },
            $inc: { __v: 1 },
        },
    });

    return successResponse({
        res,
        statusCode: 200,
        message: "email confirmed successfully",
    });
};

// ----------------- Google Login -----------------
async function verifyGoogleAccount({ idToken }) {
    const client = new OAuth2Client(process.env.CLIENT_ID);

    const tiket = await client.verifyIdToken({
        idToken,
        audience: process.env.CLIENT_ID,
    });

    const payLoad = tiket.getPayload();
    return payLoad;
}

export const loginWithGmail = async (req, res, next) => {
    const { idToken } = req.body;
    const { email, email_verified, picture, given_name, family_name } =
        await verifyGoogleAccount({ idToken });

    if (!email_verified)
        return next(new Error("google account not verified", { cause: 400 }));

    const user = await findOne({
        module: userModel,
        filter: { email },
    });

    if (user) {
        if (user.provider !== provider.google) {
            return next(new Error("This Email Already Exists ", { cause: 400 }));
        }

        const newCredentials = await getNewLogInCredentials(user);


        return successResponse({
            res,
            statusCode: 200,
            message: "user logged successfully",
            data: { newCredentials },
        });
    } else {
        const nweUser = await create({
            module: userModel,
            data: [
                {
                    email,
                    firstName: given_name,
                    lastName: family_name,
                    photo: picture,
                    provider: provider.google,
                    confirmEmail: Date.now(),
                },
            ],
        });

        const newCredentials = await getNewLogInCredentials(user);


        return successResponse({
            res,
            statusCode: 200,
            message: "user created successfully",
            data: { newCredentials },
        });
    }
};

// ----------------- Refresh Token -----------------
export const refreshToken = async (req, res, next) => {
    const user = req.user;
    let signature = await getSignature({
        signatureLevel: user.role != role.user ? signatureEnum.admin : signatureEnum.user,
    });

    const newCredentials = await getNewLogInCredentials(user);


    return successResponse({
        res,
        statusCode: 201,
        message: "new credentials successfully",
        data: { newCredentials },
    });
};



export const forgetPassword = async (req, res, next) => {

    const { email } = req.body;

    const otp = await customAlphabet("0123456789", 6)();
    const hashOtp = await hash({ plainText: otp });
    const user = await findOneAndUpdate({
        module: userModel,
        filter: {
            email,
            provider: provider.system,
            confirmEmail: { $exists: true },
            deleteAt: { $exists: false },
        },
        data: {
            forgetPasswordOtp: hashOtp,
        }
    });
    if (!user) return next(new Error("user not found or email not confirmed", { cause: 404 }))

    emailEvent.emit("forgetPassword", {
        to: email,
        firstName: user.firstName,
        otp,
    });

    return successResponse({
        res,
        statusCode: 200,
        message: "check your inbox",
    })

}



export const resetPassword = async (req, res, next) => {

    const { email, otp, password } = req.body;


    const user = await findOne({
        module: userModel,
        filter: {
            email,
            provider: provider.system,
            confirmEmail: { $exists: true },
            deleteAt: { $exists: false },
            forgetPasswordOtp: { $exists: true },
        }
    });
    if (!user) return next(new Error("invalid acount", { cause: 404 }))

    if (!await compare({ plainText: otp, hash: user.forgetPasswordOtp }))
        return next(new Error("invalid otp", { cause: 404 }));

    const hashedPassword = await hash({ plainText: password });


    await updateOne({
        module: userModel,
        filter: { email },
        data: {
            password: hashedPassword,
            $unset: { forgetPasswordOtp: true },
            $inc: { __v: 1 },
        },
    });

    return successResponse({
        res,
        statusCode: 200,
        message: "password reset successfully",
    })

}



