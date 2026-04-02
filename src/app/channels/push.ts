import admin from "firebase-admin";
import { INotification } from "../modules/interfaces/interface";
import config from "../config";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: config.firebase_project_id,
  });
}

export const sendPush = async (notification: INotification) => {
  await admin.messaging().send({
    token: notification.recipient,
    notification: {
      title: notification.subject ?? "Notification",
      body: notification.body,
    },
  });
};