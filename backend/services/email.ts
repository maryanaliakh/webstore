import {transporter} from "../clients/mailer";

export async function sendEmail(to: string, subject: string, html: string) {
    return transporter.sendMail({
        from: `"BUBBLE" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });
}
