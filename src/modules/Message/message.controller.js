import { Router } from "express";
import * as messageService from "./message.service.js";
import { cloudFileUpload } from "../../utils/multer/cloud.multer.js";
import { fileValidation } from "../../utils/multer/local.multer.js";
import { authentcation, tokenTypeEunm } from "../../middlewares/authentication.middlewares.js";


const router = Router()


router.post("/:recieverId/send-message", cloudFileUpload({ validation: [...fileValidation.images] }).array("attachments", 3), messageService.sendMessage);

router.post("/:recieverId/sender", authentcation({ tokenType: tokenTypeEunm.ACCESS }), cloudFileUpload({ validation: [...fileValidation.images] }).array("attachments", 3), messageService.sendMessage);

router.get("/:userId/get-messages", messageService.getMessages);


export default router;