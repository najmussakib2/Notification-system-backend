import nodemailer from "nodemailer";

import { INotification } from "../modules/interfaces/interface";
import config from "../config";

const transporter = nodemailer.createTransport({
  host: config.smtp_host,
  port: Number(config.smtp_port),
  auth: { user: config.smtp_user, pass: config.smtp_pass },
});

export const sendEmail = async (notification: INotification) => {
  await transporter.sendMail({
    from: config.smtp_user,
    to: notification.recipient,
    subject: notification.subject ?? "Notification",
    html: notification.body,
  });
};