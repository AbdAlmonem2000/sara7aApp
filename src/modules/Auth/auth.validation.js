import joi from "joi";



export const signUpValidation = {

    body: joi
        .object({
            firstName: joi.string().min(3).max(20).required().messages({
                "string.min": "First name must be at least 3 characters long",
                "string.max": "First name must be at most 20 characters long",
                "any.required": "First name is Mandatory",
            }), lastName: joi.string().min(3).max(20).required().messages({
                "string.min": "Last name must be at least 3 characters long",
                "string.max": "Last name must be at most 20 characters long",
                "any.required": "Last name is Mandatory",
            }),
            email: joi
                .string()
                .email({
                    minDomainSegments: 2,
                    maxDomainSegments: 5,
                    tlds: { allow: ["com", "net", "edu", "io", "gov", "org"] },
                })
                .required(),
            password: joi.string().pattern(/^[A-Za-z\d@#$ !? &*]{8,20}$/).required(),
            confirmPassword: joi.ref("password"),
            gender: joi.string().valid("male", "female").default("male"),
            role: joi.string().valid("USER", "ADMIN").default("USER"),
            phone: joi.string(),
        })
        .required(),


}

export const logInValidation = {
    body: joi
        .object({

            email: joi
                .string()
                .email({
                    minDomainSegments: 2,
                    maxDomainSegments: 5,
                    tlds: { allow: ["com", "net", "edu", "io", "gov", "org"] },
                })
                .required(),
            password: joi.string().required(),
        })
        .required()
}


export const forgetPasswordValidation = {
    body: joi
        .object({

            email: joi
                .string()
                .email({
                    minDomainSegments: 2,
                    maxDomainSegments: 5,
                    tlds: { allow: ["com", "net", "edu", "io", "gov", "org"] },
                })
                .required(),
        })
        .required()
}


export const resetPasswordValidation = {
    body: joi.object({
        email: joi
            .string()
            .email({
                minDomainSegments: 2,
                maxDomainSegments: 5,
                tlds: { allow: ["com", "net", "edu", "io", "gov", "org"] },
            })
            .required(),
        otp: joi.string().length(6).required(),
        password: joi
            .string()
            .pattern(/^[A-Za-z\d@#$ !?&*]{8,20}$/)
            .required(),
        confirmPassword: joi.valid(joi.ref("password")).required()
    }).required()
};
