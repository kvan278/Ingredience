const nodemailer = require('nodemailer')
const { APP_DATA } = require('../Config/app-information');
const MailLog = require('../Models/MailLog');
const ConstantService = require('../Service/ConstantsService');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: APP_DATA.MAIL_ID,
        pass: APP_DATA.MAIL_PASS
    }
})

exports.sendForgotPasswordMail = async (email, password) => {
    const mailOptions = {
        from: `${APP_DATA.NAME} <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: 'Your New Password',
        html: `
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; margin: 0;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Icon at the top center -->
                    <div style="text-align: center;">
                        <img src="${ConstantService.COMMON_ASSETS.PASSWORD_RESET_ICON}" alt="App Icon" style="width: 80px; margin-bottom: 20px;">
                    </div>
                    
                    <!-- Email Content -->
                    <h2 style="color: #333; font-size: 24px; text-align: center;">Password Reset</h2>
                    <p style="font-size: 16px; color: #555;">Your password has been reset successfully. Here is your new password:</p>
    
                    <!-- Password Section -->
                    <div style="display: flex; align-items: center; justify-content: center; background-color: #f1f1f1; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="font-size: 18px; font-weight: bold; color: #333; margin: 0;">${password}</p>
                    </div>
    
                    <p style="font-size: 16px; color: #555;">Please log in using this password and consider changing it immediately for added security.</p>
                    <p style="font-size: 16px; color: #555;">If you did not request a password reset, please contact our support team.</p>
                    
                    <!-- Footer -->
                    <p style="font-size: 14px; color: #888; text-align: center; margin-top: 30px;">
                        Thank you,<br>${APP_DATA.NAME} Team
                    </p>
                </div>
            </body>
            </html>
        `
    };

    try {
        const data = await transporter.sendMail(mailOptions);
        const mailLog = new MailLog({
            email,
            type: ConstantService.MAIL_TEMPLATES.FORGOT_PASSWORD,
            createdAt: new Date().getTime()
        })
        await mailLog.save()
        console.log('Message sent: %s', data.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

exports.sendWelcomeMail = async (email) => {
    const mailOptions = {
        from: `${APP_DATA.NAME} <${process.env.EMAIL_FROM}>`,
        to: email,
        subject: `Welcome to Our ${APP_DATA.NAME}!`,
        html: `
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; margin: 0;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Icon at the top center -->
                    <div style="text-align: center;">
                        <img src="${ConstantService.COMMON_ASSETS.WELCOME_BANNER}" alt="Welcome Icon" style="width: 80px; margin-bottom: 20px;">
                    </div>
                    
                    <!-- Email Content -->
                    <h2 style="color: #333; font-size: 24px; text-align: center;">Welcome to ${APP_DATA.NAME}!</h2>
                    <p style="font-size: 16px; color: #555;">Dear User,</p>
                    <p style="font-size: 16px; color: #555;">We are excited to have you join our platform. Here you can find a variety of resources, connect with others, and enjoy the many features we offer.</p>
                    <p style="font-size: 16px; color: #555;">If you have any questions or need assistance, feel free to reach out to our support team. We’re here to help!</p>
                    
                    <!-- Footer -->
                    <p style="font-size: 14px; color: #888; text-align: center; margin-top: 30px;">
                        Best Regards,<br>${APP_DATA.NAME} Team
                    </p>
                </div>
            </body>
            </html>
        `
    };

    try {
        const data = await transporter.sendMail(mailOptions);
        const mailLog = new MailLog({
            email,
            type: ConstantService.MAIL_TEMPLATES.WELCOME_USER,
            createdAt: new Date().getTime()
        });
        await mailLog.save();
        console.log('Welcome email sent: %s', data.messageId);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

exports.sendOtpEmailForSignup = async (recipient, otp) => {
    const mailOptions = {
        from: `${APP_DATA.NAME} <${process.env.EMAIL_FROM}>`,
        to: recipient,
        subject: `${APP_DATA.NAME}: OTP for Signup`,
        html: `
            <html>
            <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; margin: 0;">
                <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header Section -->
                    <div style="text-align: center;">
                        <img src="${ConstantService.COMMON_ASSETS.OTP_ICON}" alt="OTP Icon" style="width: 80px; margin-bottom: 20px;">
                    </div>

                    <!-- Email Content -->
                    <h2 style="color: #333; font-size: 24px; text-align: center;">Your OTP for Signup</h2>
                    <p style="font-size: 16px; color: #555;">Thank you for signing up with ${APP_DATA.NAME}!</p>
                    <p style="font-size: 16px; color: #555;">To complete your registration, please use the following OTP:</p>
                    
                    <!-- OTP Section -->
                    <div style="display: flex; align-items: center; justify-content: center; background-color: #fcfcfc; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="font-size: 24px; font-weight: bold; color: #333; margin: 0;">${otp}</p>
                    </div>

                    <p style="font-size: 16px; color: #555;">The OTP is valid for a limited time. Please do not share it with anyone.</p>
                    <p style="font-size: 16px; color: #555;">If you didn’t request this, please ignore this email or contact our support team for assistance.</p>
                    
                    <!-- Footer -->
                    <p style="font-size: 14px; color: #888; text-align: center; margin-top: 30px;">
                        Thank you,<br>${APP_DATA.NAME} Team
                    </p>
                </div>
            </body>
            </html>
        `
    };

    try {
        // Send the email
        const data = await transporter.sendMail(mailOptions);

        // Log the email to the database
        const mailLog = new MailLog({
            email: recipient,
            type: ConstantService.MAIL_TEMPLATES.SIGNUP_OTP,
            createdAt: new Date().getTime()
        });
        await mailLog.save();

        console.log('OTP email sent: %s', data.messageId);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};

exports.sendWithTransporter = async (mailOptions) => {
    try {
        return transporter.sendMail(mailOptions)
    } catch (err) {
        console.log('Something went wrong in transporter...', err)
    }
}
