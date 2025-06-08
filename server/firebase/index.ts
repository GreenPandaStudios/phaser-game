import admin from "firebase-admin";

admin.initializeApp({
	credential: admin.credential.cert(
		process.env.FIREBASE_SERVICE_ACCOUNT_KEY
			? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
			: {}
	),
});

export const db = admin.firestore();
