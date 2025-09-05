import { Router } from "express";
import * as userService from "./user.service.js";
import { authentcation, authorization, tokenTypeEunm } from "../../middlewares/authentication.middlewares.js";
import { endPoints } from "./user.authorization.js";
import { validation } from "../../middlewares/validation.middlewares.js";
import { coverImageValidation, freezeAcountValidation, hardDeletedAcountValidation, profileImageValidation, restoreAcountValidation, shareProfileValidation, updatePasswordValidation, updateProfileValidation } from "./user.validation.js";
import { fileValidation, localFileUpload } from "../../utils/multer/local.multer.js";
import { cloudFileUpload } from "../../utils/multer/cloud.multer.js";

const router = Router()

router.get("/getProfile", authentcation({ tokenType: tokenTypeEunm.ACCESS }), authorization({ accessRoles: endPoints.getProfile }), userService.getSingelUser)

router.get("/share-profile/:userId", validation(shareProfileValidation), userService.shareProfile);


router.patch("/update-profile/", validation(updateProfileValidation), authentcation({ tokenType: tokenTypeEunm.ACCESS }), authorization({ accessRoles: endPoints.updateProfile }), userService.updateProfile);


router.delete("{/:userId}/freeze-acount/", validation(freezeAcountValidation), authentcation({ tokenType: tokenTypeEunm.ACCESS }), authorization({ accessRoles: endPoints.freezeAcount }), userService.freezeAcount);


router.patch("/:userId/restore-acount/", validation(restoreAcountValidation), authentcation({ tokenType: tokenTypeEunm.ACCESS }), authorization({ accessRoles: endPoints.restoreAcount }), userService.restoreAcount);

router.delete("/:userId/hard-deleted/", validation(hardDeletedAcountValidation), authentcation({ tokenType: tokenTypeEunm.ACCESS }), authorization({ accessRoles: endPoints.hardDeletedAcount }), userService.hardDeletedAcount);

router.patch("/update-password/", validation(updatePasswordValidation), authentcation({ tokenType: tokenTypeEunm.ACCESS }), authorization({ accessRoles: endPoints.updatePassword }), userService.updatePassword);

// router.patch("/profile-image/", authentcation({ tokenType: tokenTypeEunm.ACCESS }), localFileUpload({ customPath: "user", validation: [...fileValidation.images] }).single("profileImage"), validation(profileImageValidation), userService.uploadProfileImage);
router.patch("/profile-image/", authentcation({ tokenType: tokenTypeEunm.ACCESS }), cloudFileUpload({ validation: [...fileValidation.images] }).single("profileImage"), userService.uploadProfileImage);

// router.patch("/cover-images/", authentcation({ tokenType: tokenTypeEunm.ACCESS }), cloudFileUpload({ validation: [...fileValidation.images] }).single("images",5), userService.uploadCoverImages);
router.patch("/cover-images/", authentcation({ tokenType: tokenTypeEunm.ACCESS }), cloudFileUpload({ validation: [...fileValidation.images] }).array("images", 5), userService.uploadCoverImages);

export default router;