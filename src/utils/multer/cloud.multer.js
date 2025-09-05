import multer from "multer";

export const cloudFileUpload = ({ validation = [] }) => {

    const storage = multer.diskStorage({


    });
    const fileFilter = (req, file, cb) => {
        if (validation.includes(file.mimetype)) cb(null, true);
        else cb(new Error("Invalied file format"), false);
    };
    return multer({ storage, fileFilter });
}