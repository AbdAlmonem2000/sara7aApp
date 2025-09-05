
export const validation = (schema) => {
    return (req, res, next) => {
        const validationError = [];

        for (const key of Object.keys(schema)) {
            const validationResults = schema[key].validate(req[key], {
                abortEarly: false,
                allowUnknown: true,
            });
            if (validationResults.error)
                validationError.push({ key, details: validationResults.error.details })

        }

        if (validationError.length)
            return res.status(400).json({
                massage: "Validation Error",
                details: validationError,
            })

        return next();
    };
};