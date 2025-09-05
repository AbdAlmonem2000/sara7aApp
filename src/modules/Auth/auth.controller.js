import { Router } from "express";
import * as authServer from "./auth.service.js"
import { authentcation, tokenTypeEunm } from "../../middlewares/authentication.middlewares.js";
import { validation } from "../../middlewares/validation.middlewares.js";
import { forgetPasswordValidation, logInValidation, resetPasswordValidation, signUpValidation } from "./auth.validation.js";

const router = Router()

router.post("/signUp", validation(signUpValidation), authServer.signUp);
router.post("/logIn", validation(logInValidation), authServer.logIn);
router.post("/logout", authentcation({ tokenType: tokenTypeEunm.ACCESS }), authServer.logOut);
router.post("/social-login", authServer.loginWithGmail);
router.get("/refresh-token", authentcation({ tokenType: tokenTypeEunm.REFRESH }), authServer.refreshToken);
router.patch("/confirm-email", authServer.confirmEmail);
router.patch("/forget-password", validation(forgetPasswordValidation), authServer.forgetPassword);
router.patch("/reset-password", validation(resetPasswordValidation), authServer.resetPassword);





export default router;