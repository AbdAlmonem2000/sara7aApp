import multer from "multer";
import path from "path";
import fs from "fs";


export const fileValidation = {
    images: ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/webp"],
    videos: ["video/mp4", "video/mkv", "video/avi", "video/mov", "video/webm"],
    audios: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp3"],
    document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "application/zip", "application/x-rar-compressed",
        "application/vnd.rar",
        "application/x-7z-compressed",
        "application/x-tar",
        "application/gzip"],
}


export const localFileUpload = ({ customPath = "gereral", validation = [] }) => {
    let beasedPath = `uploads/${customPath}`;

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            if (req.user?._id) beasedPath += `/${req.user._id}`;
            const fullPath = path.resolve(`./src/${beasedPath}`);
            if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
            cb(null, path.resolve(fullPath));
        },
        filename: (req, file, cb) => {
            const uniqueFileName = Date.now() + '-_' + Math.round() + "__" + file.originalname;
            file.finalPath = `${beasedPath}/${uniqueFileName}`;
            cb(null, uniqueFileName);
        }

    });
    const fileFilter = (req, file, cb) => {
        if (validation.includes(file.mimetype)) cb(null, true);
        else cb(new Error("Invalied file format"), false);
    };
    return multer({ storage, fileFilter });
}