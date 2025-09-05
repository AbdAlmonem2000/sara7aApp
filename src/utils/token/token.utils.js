// token.utils.js
import jwt from "jsonwebtoken";
import { role } from "../../DB/models/user.model.js";
import { nanoid } from "nanoid";

export const signatureEnum = {
    admin: "Admin",
    user: "User",
};

export const signToken = ({ payLoad = {}, signature, Options = { expiresIn: "1d" } }) => {
    return jwt.sign(payLoad, signature, Options);
};

export const verifyToken = ({ token = "", signature }) => {
    return jwt.verify(token, signature);
};

export const getSignature = async ({ signatureLevel = signatureEnum.user }) => {
    let signature = { accessSignature: undefined, refreshSignature: undefined };

    switch (signatureLevel) {
        case signatureEnum.admin:
            signature.accessSignature = process.env.ACCESS_ADMIN_SIGNATURE_TOKEN;
            signature.refreshSignature = process.env.REFREH_ADMIN_SIGNATURE_TOKEN;
            break;
        case signatureEnum.user:
            signature.accessSignature = process.env.ACCESS_USER_SIGNATURE_TOKEN;
            signature.refreshSignature = process.env.REFREH_USER_SIGNATURE_TOKEN;
            break;
        default:
            console.error("Invalid Signature Level");
            break;
    }
    return signature;
};




export const getNewLogInCredentials = async (user) => {
    let signature = await getSignature({
        signatureLevel: user.role != role.user ? signatureEnum.admin : signatureEnum.user,
    });

    const jwtId = nanoid();

    const accessToken = signToken({
        payLoad: { _id: user._id, jti: jwtId },
        signature: signature.accessSignature,
        Options: { issuer: "sra7aApp", subject: "Auth", expiresIn: 60 * 60 * 24 },
    });

    const refreshToken = signToken({
        payLoad: { _id: user._id, jti: jwtId },
        signature: signature.refreshSignature,
        Options: { issuer: "sra7aApp", subject: "Auth", expiresIn: "1d" },
    });

    return { accessToken, refreshToken };
}

