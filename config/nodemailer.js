const nodemailer = require('nodemailer');
require("dotenv").config();



let transporter = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.DB_MAIL_LOG,
        pass: process.env.DB_MAIL_PASS
    }
});

module.exports = transporter;