import nodemailer from "nodemailer";
import { EMAIL_PASS, EMAIL_USER, SMTP_HOST, SMTP_PORT } from "../secrets";
export const sendAdminRegistrationEmail = async (email: string, adminName: string) => {
    try {
        // Configure the transporter (Use real SMTP credentials)
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: false, // Use `true` for port 465, `false` for 587
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail email
                pass: process.env.EMAIL_PASS, // Your Gmail App Password
            },
            tls: {
                rejectUnauthorized: false, // Bypass certificate issues (if any)
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Admin Account Registration",
            text: `
                Hello ${adminName},

                Your admin account has been successfully registered.
                You can now log in with the following credentials:

                Email: ${email}
                Password: 12345

                Best regards,
                HCDT Team

                **Please do not reply to this email. This is an automated message.**`
            ,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to", email);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};