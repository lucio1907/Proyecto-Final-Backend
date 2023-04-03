import twilio from "twilio";
import logConfiguration from "./log4jsConfig.js";

const logger = logConfiguration.getLogger(process.env.NODE_ENV);

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.ACCOUNT_AUTH_TOKEN;

const sendMessageToUser = async (currentUser) => {
    const client = twilio(accountSid, authToken);

    try {
        const message = await client.messages.create({
            body: "Hi! Your order has been received and is being processed by our team\n Backend team!",
            from: "+15677496193",
            to: `+${currentUser.phone}`
        })
        logger.info(message);
    } catch (error) {
        logger.error(error);
    }
}

export default sendMessageToUser;