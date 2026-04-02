import twilio from "twilio";
import { INotification } from "../modules/interfaces/interface";
import config from "../config";

const client = twilio(config.twilio_account_sid, config.twilio_auth_token);

export const sendSms = async (notification: INotification) => {
  await client.messages.create({
    body: notification.body,
    from: config.twilio_phone_number,
    to: notification.recipient,
  });
};