import Joi from "joi";
import { fileValidation } from "../../utils/multer/local.multer.js";



export const shareProfileValidation = {
    params: Joi.object({
        userId: Joi.string().hex().length(24).required(),
    })
}



export const updateProfileValidation = {
    body: Joi.object({
        firstName: Joi.string().min(3).max(20).required().messages({
            "string.min": "First name must be at least 3 characters long",
            "string.max": "First name must be at most 20 characters long",
            "any.required": "First name is Mandatory",
        }), lastName: Joi.string().min(3).max(20).required().messages({
            "string.min": "Last name must be at least 3 characters long",
            "string.max": "Last name must be at most 20 characters long",
            "any.required": "Last name is Mandatory",
        }),
        gender: Joi.string().valid("male", "female").default("male"),
        phone: Joi.string(),


    })
}



export const freezeAcountValidation = {
    params: Joi.object({
        userId: Joi.string().hex().length(24),
    })
}


export const restoreAcountValidation = {
    params: Joi.object({
        userId: Joi.string().hex().length(24).required(),
    })
}


export const hardDeletedAcountValidation = {
    params: Joi.object({
        userId: Joi.string().hex().length(24).required(),
    })
}


export const updatePasswordValidation = {

    body: Joi.object({

        oldPassword: Joi.string().pattern(/^[A-Za-z\d@#$ !? &*]{8,20}$/).required(),
        password: Joi.string().pattern(/^[A-Za-z\d@#$ !? &*]{8,20}$/).not(Joi.ref("oldPassword")).required(),
        confirmPassword: Joi.ref("password"),
    })
};


export const profileImageValidation = {

    file: Joi.object({
        originalname: Joi.string().required(),
        mimetype: Joi.string().valid(...fileValidation.images).required(),
        size: Joi.number().max(5 * 1024 * 1024).positive().required(), // max 5MB
        fieldname: Joi.string().required(),
        filename: Joi.string().required(),
        finalPath: Joi.string().required(),
        destination: Joi.string().required(),
        encoding: Joi.string().required(),

    }).required()
};


export const coverImageValidation = {
    files: Joi.array()
        .items(
            Joi.object({
                originalname: Joi.string().required(),
                mimetype: Joi.string().valid(...fileValidation.images).required(),
                size: Joi.number().max(5 * 1024 * 1024).positive().required(), // max 5MB
                fieldname: Joi.string().required(),
                filename: Joi.string().required(),
                finalPath: Joi.string().required(),
                destination: Joi.string().required(),
                encoding: Joi.string().required(),
            }).required()
        )
        .required(),
};
