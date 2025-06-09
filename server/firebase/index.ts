import admin from "firebase-admin";

admin.initializeApp(); // Use the default credentials

export const db = admin.firestore();
