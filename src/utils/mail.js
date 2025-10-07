import Mailgen from "mailgen";
import nodemailer from "nodemailer"
import dotenv from "dotenv"

//send email
const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "https://taskmanagerlink.com"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
    const emailHtml = mailGenerator.generate(options.mailgenContent)


    const transpoter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mail = {
        from: "mail.traskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    }

    try {
        await transpoter.sendMail(mail)
    } catch (error) {
        console.error("Email service failed silently Make Sure that you have provide your MAILTRAP credentials in the .env file");
        console.error("Error", error)
    }
    
}

//email verification mailgen
const emailVerificationMailgenContent = ( username, verificationUrl ) => {
    return {
        body: {
        name: username,
        intro: "Welcome to our App! we're exited to have you on board.",
        action: {
            instructions: "To verify on Email please click on the following the button",
            button: {
              color: "#1aae5eff",
              text: "Verfiy your email",
              link: verificationUrl
                
                }
            },
            outro: "Need help, or have question? just reply to this email, we'd love to help"
        }
    }
};


//forgot password mailgen

const forgotPasswordMailgenContent = ( username, passwordResetUrl ) => {
    return {
        body: {
        name: username,
        intro: "We got a request to reset the password of your account",
        action: {
            instructions: "To reset your password click on the following button or link",
            button: {
              color: "#1aae5eff",
              text: "Reset your password",
              link: passwordResetUrl
                
                }
            },
            outro: "Need help, or have question? just reply to this email, we'd love to help"
        }
    }
}


export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
}
