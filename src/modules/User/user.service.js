import { decrypt, encrypt } from "../../utils/encryption/encryption.utils.js";
import { successResponse } from "../../utils/successResponse.utils.js";
import * as dbservice from "../../DB/dbService.js";
import { role, userModel } from "../../DB/models/user.model.js";
import { compare, hash } from "../../utils/hashing/hash.utils.js";
import { cloudinaryConfig } from "../../utils/multer/cloudinary.js";




export const getSingelUser = async (req, res, next) => {

    // const { authorization } = req.headers;

    //     const decoded = verifyToken({ token: authorization });

    //     const user = await DBservice.findById({ module: userModel, id: { _id: decoded._id } })


    req.user.phone = decrypt(req.user.phone);

    const user = await dbservice.findById({
        module: userModel,
        id: req.user._id,
        populate: [{ path: "message" }]

    });

    return successResponse({ res, data: { user }, statusCode: 200, message: "User fetched successfully" });
}




export const shareProfile = async (req, res, next) => {
    const { userId } = req.params

    const user = await dbservice.findOne({
        module: userModel,
        filter: { _id: userId, confirmEmail: { $exists: true } },
    });
    return user ? successResponse({
        res,
        statusCode: 200,
        message: "user fetched successfully",
        data: { user },
    }) : next(new Error("user not confirmed", { cause: 404 }));
}


export const updateProfile = async (req, res, next) => {


    if (req.body.phone) {
        req.body.phone = await encrypt(req.body.phone);
    }

    const updatedUser = await dbservice.findOneAndUpdate({
        module: userModel,
        filter: { _id: req.user._id },
        data: req.body,
    });
    return updatedUser ? successResponse({
        res,
        statusCode: 200,
        message: "user updated successfully",
        data: { updatedUser },
    }) : next(new Error("user not updated", { cause: 404 }));
}



export const freezeAcount = async (req, res, next) => {

    const { userId } = req.params;

    if (userId && req.user.role !== role.admin) {
        return next(new Error("you are not admin", { cause: 403 }))
    };



    const updatedUser = await dbservice.findOneAndUpdate({
        module: userModel,
        filter: { _id: userId || req.user._id, deletedAt: { $exists: false } },
        data: {
            deletedAt: Date.now(),
            deletedBy: req.user._id,
            $unset: {
                restoredAt: true,
                restoredBy: true,
            },
        },
    });

    return updatedUser ? successResponse({
        res,
        statusCode: 200,
        message: "User frozen successfully",
        data: { updatedUser },
    }) : next(new Error("Invalid Accouht", { cause: 404 }));

};



export const restoreAcount = async (req, res, next) => {

    const { userId } = req.params;


    const updateUser = await dbservice.findOneAndUpdate({
        module: userModel,
        filter: {
            _id: userId,
            deletedAt: { $exists: true },
            deletedBy: { $ne: userId },
        },
        data: {
            $unset: {
                deletedAt: true,
                deletedBy: true,
            },
            restoredAt: Date.now(),
            restoredBy: req.user._id,
        },


    });
    return updateUser ? successResponse({
        res,
        statusCode: 200,
        message: "User restored successfully",
        data: { updateUser },
    }) : next(new Error("Invalid Accouht", { cause: 404 }));

};



export const hardDeletedAcount = async (req, res, next) => {

    const { userId } = req.params;


    const user = await dbservice.deleteOne({
        module: userModel,
        filter: {
            _id: userId,
            deletedAt: { $exists: true },
        },



    });
    return user.deletedCount ? successResponse({
        res,
        statusCode: 200,
        message: "User deleted successfully",
    }) : next(new Error("Invalid Accouht", { cause: 404 }));

};



export const updatePassword = async (req, res, next) => {

    const { password, oldPassword } = req.body;

    if (!(await compare({ plainText: oldPassword, hash: req.user.password })))
        return next(new Error("Invalid old Password", { cause: 400 }));

    const user = await dbservice.findOneAndUpdate({
        module: userModel,
        filter: {
            _id: req.user._id,
        },
        data: {
            password: await hash({ plainText: password }),
        }



    });
    return user ? successResponse({
        res,
        statusCode: 200,
        message: "password updated successfully",
        data: { user }
    }) : next(new Error("Invalid Accouht", { cause: 404 }));

};



export const uploadProfileImage = async (req, res, next) => {
    //local
    // const user = await dbservice.findOneAndUpdate({
    //     module: userModel,
    //     filter: { _id: req.user._id },
    //     data: { profileImage: req.file.finalPath },
    // });


    //cloudinary
    const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(req.file.path, {
        folder: `sara7aApp/users${req.user._id}`
    })
    const user = await dbservice.findOneAndUpdate({
        module: userModel,
        filter: { _id: req.user._id },
        data: { profileCloudImage: { secure_url, public_id } },
    });

    if (req.user.profileCloudImage?.public_id) await cloudinaryConfig().uploader.destroy(req.user.profileCloudImage.public_id)

    successResponse({
        res,
        statusCode: 200,
        message: "profile image updated successfully",
        data: { user }
    })
};




export const uploadCoverImages = async (req, res, next) => {
    //local
    // const user = await dbservice.findOneAndUpdate({
    //     module: userModel,
    //     filter: { _id: req.user._id },
    //     data: { coverImages: req.files.map((file) => file.finalPath) },
    // });

    //cloudinary
    const attachments = [];
    for (const file of req.files) {
        const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(file.path, { folder: `sara7aApp/users${req.user._id}` })
        attachments.push({ secure_url, public_id });
    }

    const user = await dbservice.findOneAndUpdate({
        module: userModel,
        filter: { _id: req.user._id },
        data: { coverCloudImages: attachments },
    });


    successResponse({
        res,
        statusCode: 200,
        message: "profile image updated successfully",
        data: { user }
    })
};



