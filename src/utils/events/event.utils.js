import { EventEmitter } from "node:events";
import { emailSubject, sendEmail } from "../email/sendEmail.utils.js";
import { template } from "../email/genretEmailHtml.js";



export const emailEvent = new EventEmitter();

emailEvent.on("confirmEmail", async (data) => {
    await sendEmail({
        to: data.to,
        subject: emailSubject.welcome,
        html: template(data.otp, data.firstName),


    })
});



emailEvent.on("forgetPassword", async (data) => {
    await sendEmail({
        to: data.to,
        subject: emailSubject.resetPassword,
        html: template(data.otp, data.firstName),


    })
});
