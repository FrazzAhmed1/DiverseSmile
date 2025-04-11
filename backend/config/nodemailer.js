import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', 
    port: parseInt(process.env.SMTP_PORT), 
    secure: false, 
    auth: {
        user: '8a2bc3001@smtp-brevo.com', 
        pass: 'vI3JjbksnAOXrzdw' 
    },
    tls: {
        rejectUnauthorized: false 
    }
});

export const sendEmail = async (mailOptions) => {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('SMTP credentials not configured');
        }

        mailOptions.from = process.env.SENDER_EMAIL;
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Email send error:', error.message);
        return false;
    }
};