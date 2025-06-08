import admin from "firebase-admin";

admin.initializeApp({
	credential: admin.credential.cert(
		process.env.FIREBASE_SERVICE_ACCOUNT_KEY
			? JSON.parse(
					Buffer.from(
						process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
						"base64"
					).toString()
			  )
			: {}
	),
});

export const db = admin.firestore();
