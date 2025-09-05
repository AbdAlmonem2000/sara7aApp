import * as DBservice from '../../DB/dbService.js';
import { messageModel } from '../../DB/models/message.models.js';
import { userModel } from '../../DB/models/user.model.js';
import { cloudinaryConfig } from '../../utils/multer/cloudinary.js';
import { successResponse } from '../../utils/successResponse.utils.js';


export const sendMessage = async (req, res, next) => {
    const { recieverId } = req.params;
    const { content } = req.body;

    if (!await DBservice.findOne({
        module: userModel,
        filter: {
            _id: recieverId,
            deletedAt: { $exists: false },
            confirmEmail: { $exists: true },
        },
    })) {
        return next(new Error("invalid reciver id", { cause: 400 }));
    }

    const attachments = [];

    if (req.files) {
        for (const file of req.files) {
            const { secure_url, public_id } = await cloudinaryConfig().uploader.upload(file.path, { folder: `sara7aApp/messages/${recieverId}` });
            attachments.push({ secure_url, public_id });
        }
    }

    const message = await DBservice.create({
        module: messageModel,
        data: [{
            content,
            attachments,
            recieverId,
            senderId: req.user?._id,
        }]
    });

    return successResponse({
        res,
        statusCode: 201,
        message: "message sent successfully",
        data: { message }
    })
};




export const getMessages = async (req, res, next) => {
    const { userId } = req.params;


    const messages = await DBservice.find({
        module: messageModel,
        filter: {
            recieverId: userId,
        },

    });

    return successResponse({
        res,
        statusCode: 201,
        message: "messages fetched successfully",
        data: { messages }
    })
};