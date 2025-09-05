import { userModel } from "../DB/models/user.model.js";
import * as DBservice from "../DB/dbService.js";
import { getSignature, verifyToken } from "../utils/token/token.utils.js";
import { tokenModel } from "../DB/models/token.model.js";

export const tokenTypeEunm = {
    ACCESS: "access",
    REFRESH: "refresh"
}

const decodedToken = async ({ authorization, tokenType = tokenTypeEunm.ACCESS, next }) => {
    if (!authorization)
        return next(new Error("Authorization header missing", { cause: 400 }));

    const [bearer, token] = authorization.split(" ") || [];

    if (!bearer || !token)
        return next(new Error("Invalid Token format", { cause: 400 }));

    // احصل على التواقيع الصحيحة
    let signature = await getSignature({
        signatureLevel: tokenType === tokenTypeEunm.ACCESS ? "User" : "User", // هنا ممكن تحدد حسب الـ token type
    });

    const decoded = verifyToken({
        token,
        signature: tokenType === tokenTypeEunm.ACCESS ? signature.accessSignature : signature.refreshSignature
    });

    // تحقق إذا كان الـ token ملغى
    const revokedToken = await DBservice.findOne({ module: tokenModel, filter: { jti: decoded.jti } });
    if (revokedToken) return next(new Error("Token revoked", { cause: 401 }));

    // احصل على بيانات المستخدم
    const user = await DBservice.findById({ module: userModel, id: decoded._id });
    if (!user) return next(new Error("user not found", { cause: 401 }));

    return { user, decoded };
}

export const authentcation = ({ tokenType = tokenTypeEunm.ACCESS }) => {
    return async (req, res, next) => {
        try {
            const { user, decoded, file } = await decodedToken({
                authorization: req.headers.authorization,
                tokenType,
                next,
            });
            req.user = user;
            req.decoded = decoded;
            req.file = file;
            return next();
        } catch (err) {
            return next(err);
        }
    }
}

export const authorization = ({ accessRoles = [] }) => {
    return async (req, res, next) => {
        if (!accessRoles.includes(req.user.role))
            return next(new Error("Access Denied", { cause: 403 }));
        return next();
    }
}
