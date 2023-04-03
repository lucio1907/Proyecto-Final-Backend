import dotenv from "dotenv";
import nodemailer from "nodemailer";
import logConfiguration from "./log4jsConfig.js";

dotenv.config();

const logger = logConfiguration.getLogger(process.env.NODE_ENV);

const adminEmail = process.env.ADMINISTRATOR_EMAIL;

const sendEmail = (currentUser, order) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.ADMINISTRATOR_EMAIL,
            pass: process.env.ADMINISTRATOR_PASSWORD
        }
    });


    const { username, email } = currentUser;
    let template = "";
    let total = 0;

    order.map((item, i) => {
        template += `- Product ${i + 1}: ${item.name}, quantity: ${item.quantity}, price: ${item.price}\n`
        total += item.quantity * item.price;
    })
    
    template += `Total: $${total}`

    const mailOptions = {
        from: "proyectoBackendPrueba@prueba.com",
        to: adminEmail,
        subject: `A new order has been created from ${username} with email ${email}`,
        text: template
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            logger.error(err);
        } else {
            logger.log(`Email sended ${info.response}`);
        }
    })
}

export default sendEmail;