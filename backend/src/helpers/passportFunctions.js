import nodemailer from "nodemailer";
import dotenv from "dotenv";

// TODO: Verifica si se carga avatar o no, ya que en este caso es opcional
const checkAvatar = (avatar) => {
  if (!avatar || avatar === undefined) return "No avatar selected";

  if (avatar.length > 0) return avatar;
};

const sendEmailToAdministrator = (user) => {
    const date = new Date(user.createdAt);
    const dateToString = date.toISOString().slice(0,10);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.ADMINISTRATOR_EMAIL,
            pass: process.env.ADMINISTRATOR_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.ADMINISTRATOR_EMAIL,
        to: process.env.ADMINISTRATOR_EMAIL,
        subject: "New Register",
        html: `
        <html>
            <head>
                <style>
                    body {
                        font-family: Verdana, sans-serif;
                        font-size: 16px;
                        line-height: 1.5;
                        color: #333;
                    }
                    h1 {
                        font-size: 28px;
                        color: #0057e7;
                    }
                    p {
                        margin-bottom: 20px;
                    }
                    span {
                        font-weight: 700;
                        text-transform: capitalize;
                    }
                </style>
            </head>
            <body>
                <h1>Has been a New Register in your site</h1>
                <p>Hi,</p>
                <p>You have a new user in your site, congratulations!</p>
                <p>User data: </p>
                <ul>
                    <li><span>Username: </span>${user.username},</li>
                    <li><span>Email: </span>${user.email},</li>
                    <li><span>Address: </span>${user.address}</li>
                    <li><span>Age: </span>${user.age}</li>
                    <li><span>Phone number: </span>${user.phone}</li>
                    <li><span>Created at: </span>${dateToString}</li>
                </ul>
            </body>
        </html>
    `
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`Email has been sended: ${info.response}`);
        }
    })
}

export { checkAvatar, sendEmailToAdministrator };