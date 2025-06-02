import Phaser from "phaser";

export const bindKeys = <
	T,
	K extends { [key: string]: Phaser.Input.Keyboard.Key }
>(
	gameObject: Phaser.GameObjects.GameObject,
	keys: { [key: string]: number },
	callback: (keyStates: Record<string, boolean>) => T
) => {
	if (!gameObject.scene.input.keyboard) {
		throw new Error("Keyboard input is not available");
	}

	var keyObjects = gameObject.scene.input.keyboard.addKeys({ ...keys }) as K;

	const keyStates: { [key: string]: boolean } = {};
	for (const key in keyObjects) {
		keyStates[key] = false;
		(keyObjects[key] as Phaser.Input.Keyboard.Key).on("down", () => {
			keyStates[key] = true;
			callback(keyStates);
		});
		keyObjects[key].on("up", () => {
			keyStates[key] = false;
			callback(keyStates);
		});
	}
};

interface VectorKeys extends Record<string, number> {
	up: number;
	down: number;
	left: number;
	right: number;
}

export const bindVectorKeys = (
	gameObject: Phaser.GameObjects.GameObject,
	keys: VectorKeys,
	setVector: (setTo: Phaser.Math.Vector2) => void
) => {
	bindKeys(gameObject, keys, (keyStates) => {
		setVector(
			new Phaser.Math.Vector2(
				keyStates["left"] ? -1 : keyStates["right"] ? 1 : 0,
				keyStates["up"] ? -1 : keyStates["down"] ? 1 : 0
			)
		);
	});
};

export const bindKey = (
	gameObject: Phaser.GameObjects.GameObject,
	key: number,
	callback: (keyState: boolean) => void
) => {
	bindKeys(gameObject, { key: key }, (keyStates) => {
		callback(keyStates["key"]);
	});
};
