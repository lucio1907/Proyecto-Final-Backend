import admin from "firebase-admin";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const serviceAccount = JSON.parse(
  fs.readFileSync(process.env.CREDENTIALS, "utf-8")
);

const connectionFirestore = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  const db = admin.firestore();

  return db;
};

export default connectionFirestore;
