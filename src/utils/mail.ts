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
      // text: `
      //     Hello ${adminName},

      //     Your ${type.trim().toLowerCase()} account has been successfully registered.
      //     You can now log in with the following credentials, navigate to setting and change your password:

      //     Email: ${email}
      //     Password: 12345

      //     Best regards,
      //     HCDT Team

      //     **Please do not reply to this email. This is an automated message.**`
      // ,
      html: `
            <p>Hello ${adminName},</p>
    
            <p>Your <strong>${type.trim().toLowerCase()}</strong> account has been successfully registered.</p>
    
            <p>You can now log in using the credentials provided below:</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> 12345</p>
    
            <p>Click the link below to log in:</p>
            <p><a href="https://app-hcdtmonitor.netlify.app/" target="_blank">Go to Login Page</a></p>
    
            <p>Best regards,<br>HCDT Team</p>
    
            <p style="color: gray; font-size: 12px;"><em>Please do not reply to this email. This is an automated message.</em></p>
        `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully to", email);
  } catch (error) {
    // console.error("Error sending email:", error);
  }
};
// export const sendConflictReportEmail = async (email: string, type: string) => {
//     try {

//         // Configure the transporter (Use real SMTP credentials)
//         const transporter = nodemailer.createTransport({
//             host: SMTP_HOST,
//             port: Number(SMTP_PORT),
//             secure: true, // Use `true` for port 465, `false` for 587
//             auth: {
//                 user: EMAIL_USER, // Your Gmail email
//                 pass: EMAIL_PASS, // Your Gmail App Password
//             },
//             tls: {
//                 rejectUnauthorized: false, // Bypass certificate issues (if any)
//             },
//         });

//         // Email options
//         const mailOptions = {
//             from: EMAIL_USER,
//             to: email,
//             subject: `${type} Survey Report`,
//             // text: `
//             //     Hello ${adminName},

//             //     Your ${type.trim().toLowerCase()} account has been successfully registered.
//             //     You can now log in with the following credentials, navigate to setting and change your password:

//             //     Email: ${email}
//             //     Password: 12345

//             //     Best regards,
//             //     HCDT Team

//             //     **Please do not reply to this email. This is an automated message.**`
//             // ,
//             html: `
//             <!DOCTYPE html>
//             <html>
//             <head>
//                 <meta charset="UTF-8" />
//                 <title>${type} Survey Notification</title>
//             </head>
//             <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
//                 <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//                 <h2 style="color: #1a73e8;">${type} Survey Submitted</h2>
//                 <p>Dear Recipient,</p>
//                 <p>
//                     This is to notify you that a new <strong>${type.trim().toLowerCase()}</strong> survey titled  has been submitted successfully.
//                 </p>
//                 <p style="color: #888888; font-size: 14px;">
//                     Please note that this is an automated message. Do not reply to this email.
//                 </p>
//                 <p>Thank you,<br /><strong>HCDT</strong></p>
//                 </div>
//             </body>
//             </html>
//         `,
//         };

//         // Send the email
//         await transporter.sendMail(mailOptions);
//         // console.log("Email sent successfully to", email);
//     } catch (error) {
//         // console.error("Error sending email:", error);
//     }
// };



export const sendConflictReportEmail = async (emails: string[], type: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: emails.join(','), // Join multiple emails
      subject: `${type} Survey Report`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8" />
            <title>${type} Survey Notification</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1a73e8;">${type} Survey Submitted</h2>
            <p>Dear Recipient,</p>
            <p>
                This is to notify you that a new <strong>${type.trim().toLowerCase()}</strong> survey has been submitted successfully.
            </p>
            <p style="color: #888888; font-size: 14px;">
                Please note that this is an automated message. Do not reply to this email.
            </p>
            <p>Thank you,<br /><strong>HCDT</strong></p>
            </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
export const sendReportLinkEmail = async (emails: string[], type: string,link:string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: true,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: emails.join(','), // Join multiple emails
      subject: `${type} Survey Invitation`,
      html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8" />
              <title>${type} Survey Invitation</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
              <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                <h2 style="color: #1a73e8; text-align: center;">${type} Survey Invitation</h2>
                
                <p>Dear Recipient,</p>

                <p>
                  You have been invited to complete a brief <strong>${type} Survey</strong> to help us better understand issues and improve our engagement with host communities.
                </p>

                <p>
                  Please click the link below to access the private survey form:
                </p>

                <p style="text-align: center; margin: 30px 0;">
                  <a href="${link}" style="background-color: #1a73e8; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Take the Survey
                  </a>
                </p>

                <p>
                  Kindly complete the survey as soon as possible. Your responses will remain confidential and will be used solely for research and development purposes.
                </p>

                <p style="color: #888888; font-size: 13px;">
                  This is an automated message. Please do not reply to this email.
                </p>

                <p>Thank you,<br /><strong>HCDT Team</strong></p>
              </div>
            </body>
          </html>

      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
