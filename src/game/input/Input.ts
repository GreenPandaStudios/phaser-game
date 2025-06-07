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

export const bindManyKeysToVector = (
	gameObject: Phaser.GameObjects.GameObject,
	keys: [VectorKeys, ...VectorKeys[]],
	setVector: (setTo: Phaser.Math.Vector2) => void
) => {
	// Create a new keyset that maps each key to a named key for tracking
	const combinedKeys: Record<string, number> = {};

	// For each set of keys, add them to the combined keys object with a suffix
	keys.forEach((keySet, index) => {
		for (const key in keySet) {
			combinedKeys[`${key}-${index}`] = keySet[key];
		}
	});

	bindKeys(gameObject, combinedKeys, (keyStates) => {
		// Calculate the vector based on the key states
		const x = Object.keys(keyStates).some(
			(key) => key.startsWith("left-") && keyStates[key]
		)
			? -1
			: Object.keys(keyStates).some(
					(key) => key.startsWith("right-") && keyStates[key]
			  )
			? 1
			: 0;
		const y = Object.keys(keyStates).some(
			(key) => key.startsWith("up-") && keyStates[key]
		)
			? -1
			: Object.keys(keyStates).some(
					(key) => key.startsWith("down-") && keyStates[key]
			  )
			? 1
			: 0;
		setVector(new Phaser.Math.Vector2(x, y));
	});
};

export const bindTouch = (
	gameObject: Phaser.GameObjects.GameObject,
	callback: (touchPositions: Phaser.Math.Vector2[]) => void
) => {
	const touchPositions: Map<number, Phaser.Math.Vector2> = new Map();

	if (!gameObject.scene.input) {
		throw new Error("Touch input is not available");
	}
	gameObject.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
		touchPositions.set(
			pointer.id,
			new Phaser.Math.Vector2(pointer.x, pointer.y)
		);
		callback(Array.from(touchPositions.values()));
	});
	gameObject.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
		// Handle touch input updates
		if (!pointer.isDown) return;
		touchPositions.set(
			pointer.id,
			new Phaser.Math.Vector2(pointer.x, pointer.y)
		);
		callback(Array.from(touchPositions.values()));
	});
	gameObject.scene.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
		// Handle touch input updates
		touchPositions.delete(pointer.id);
		callback(Array.from(touchPositions.values()));
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

export const bindManyKeys = (
	gameObject: Phaser.GameObjects.GameObject,
	keys: number[],
	callback: (keyState: boolean) => void
) => {
	const keyMap: Record<string, number> = {};
	keys.forEach((key, index) => {
		keyMap[`key-${index}`] = key;
	});
	bindKeys(gameObject, keyMap, (keyStates) => {
		callback(Object.values(keyStates).some((state) => state));
	});
};
