import Phaser from "phaser";

export const AddWASDControls = (
	gameObject: Phaser.GameObjects.GameObject,
	bindVector: () => Phaser.Math.Vector2
) => {
	if (!gameObject.scene.input.keyboard) {
		throw new Error("Keyboard input is not available");
	}

	const keys = {
		W: gameObject.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
		A: gameObject.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
		S: gameObject.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
		D: gameObject.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
	};

	const updateInput = () => {
		const inputVector = bindVector();
		inputVector.set(
			(keys.A.isDown ? -1 : 0) + (keys.D.isDown ? 1 : 0),
			(keys.W.isDown ? -1 : 0) + (keys.S.isDown ? 1 : 0)
		);
	};

	gameObject.scene.events.on(Phaser.Scenes.Events.UPDATE, updateInput);
};
