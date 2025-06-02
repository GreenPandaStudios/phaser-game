import Phaser from "phaser";
import { AddWASDControls } from "../input";

export class Player extends Phaser.Physics.Arcade.Image {
	private speed: number = 200;

	private inputVector: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		texture: string = "player"
	) {
		super(scene, x, y, texture);

		// Add this sprite to the scene
		scene.add.existing(this);

		// Enable physics on this sprite
		scene.physics.add.existing(this, false);

		// Configure the player sprite
		this.setOrigin(0.5, 0.5)
			.setScale(0.1)
			.setBounce(0.2)
			.setCollideWorldBounds(true)
			.setDragX(0)
			.setDragY(0)
			.setMaxVelocity(this.speed * 2, this.speed * 2);

		// Add this player instance to the scene's update list
		scene.events.on("update", (time: number, delta: number) => {
			this.update(time, delta);
		});

		// Add WASD controls
		AddWASDControls(this, () => this.inputVector);
	}

	update(t: number, dt: number): void {
		super.update(t, dt);
		console.log("Input Vector:", this.inputVector);
		// Update the player's position based on input
		if (this.inputVector.length() > 0) {
			this.inputVector.normalize().scale((this.speed * dt) / 1000);
			this.setVelocity(this.inputVector.x, this.inputVector.y);
		}
	}
}
