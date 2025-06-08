import admin from "firebase-admin";

admin.initializeApp({
	credential: admin.credential.cert(
		require("/secrets/phaser-firebase-secret.json")
	),
});

export const db = admin.firestore();
