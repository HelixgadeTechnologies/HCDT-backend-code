import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER, SMTP_HOST, SMTP_PORT } from "../secrets";
export const sendAdminRegistrationEmail = async (email: string, adminName: string, type: string) => {
    try {

        // Configure the transporter (Use real SMTP credentials)
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: true, // Use `true` for port 465, `false` for 587
            auth: {
                user: EMAIL_USER, // Your Gmail email
                pass: EMAIL_PASS, // Your Gmail App Password
            },
            tls: {
                rejectUnauthorized: false, // Bypass certificate issues (if any)
            },
        });

        // Email options
        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: `${type} Account Registration`,
            text: `
                Hello ${adminName},

                Your ${type.trim().toLowerCase()} account has been successfully registered.
                You can now log in with the following credentials, navigate to setting and change your password:

                Email: ${email}
                Password: 12345

                Best regards,
                HCDT Team

                **Please do not reply to this email. This is an automated message.**`
            ,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        // console.log("Email sent successfully to", email);
    } catch (error) {
        // console.error("Error sending email:", error);
    }
};