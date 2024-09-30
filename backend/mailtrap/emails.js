import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [
        {email}
    ]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });
        console.log("Email sent successfully", response);
    } catch (error) {
        console.log(`Error sending verification`,error.message);
        throw new Error(`Error sending verification email: ${error}`);
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [
        {email}
    ]
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "474628f3-5d08-48c9-889a-652f9d22526e",
            template_variables: {
                "company_info_name": "Auth Company",
                "name": name
              },
        });
        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.log(`Error sending welcome email`, error.message);
        throw new Error(`Error sending verification email: ${error}`);
    }
}