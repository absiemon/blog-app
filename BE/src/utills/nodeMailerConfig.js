import nodemailer from 'nodemailer';
// Create a transporter using Gmail

export const nodeMailerTransporter = () => {
    const user_email = process.env.SMTP_USER_EMAIL;
    const user_password = process.env.SMTP_USER_PASSWORD;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user_email,
            pass: user_password,
        },
    });
    return transporter;
}
