import Phaser from "phaser";
import { Player } from "./Player";
import { EventBus } from "../EventBus";

export class Ball extends Phaser.Physics.Arcade.Sprite {
	private lastHit: Date = new Date();
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "ball");

		// Enable physics for the ball
		scene.physics.world.enable(this);

		this.setCollideWorldBounds(true);
		this.setBounce(0.7);
		this.setVelocity(
			Phaser.Math.Between(-200, 200),
			Phaser.Math.Between(-200, 200)
		);

		// Give the ball a circular shape for collision
		this.setCircle(8); // Assuming the ball texture is 32x32 pixels

		// Give the ball a lot of friction
		this.setFriction(0.5);
		this.setScale(2); // Scale the ball to 2x its original size

		// Make the ball lightweight
		if (this.body) {
			this.body.mass = 0.1; // Set a low mass for the ball to make it lightweight
		}

		// Add the ball to the scene
		scene.add.existing(this);

		// Allow it to collide with other objects
		scene.physics.add.collider(this, scene.children.getAll(), (ball, other) => {
			if (other instanceof Phaser.Physics.Arcade.Sprite) {
				// Handle collision with other sprites
				(ball as Ball).handleCollision(other);
			}
		});
		// Enable world bounds for the ball
		if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) {
			this.body.onWorldBounds = true;
		}

		scene.physics.world.on("worldbounds", this.handleWorldBounds, this);
	}

	static preload(scene: Phaser.Scene): void {
		scene.load.image("ball", "/gameAssets/objects/ball.png");
	}
	private collisionCount: number = 0;

	public handleWorldBounds(
		_body: Phaser.Physics.Arcade.Body,
		_up: boolean,
		down: boolean,
		_left: boolean,
		_right: boolean
	): void {
		if (down) {
			this.resetHitCounter();
		}
	}

	public handleCollision(other: Phaser.Physics.Arcade.Sprite): void {
		// If the ball is on the ground, apply a small upward force
		const otherSprite = other as Phaser.Physics.Arcade.Sprite;

		if (this.body && otherSprite.body) {
			// Apply an upwards force proportional to the force of the other velocity x
			this.setVelocityY(
				-Phaser.Math.Linear(
					0,
					500,
					Math.abs(otherSprite.body.velocity.x / 500)
				) + otherSprite.body.velocity.y // Add some vertical force based on the other sprite's velocity
			);
		}

		if (other instanceof Player) {
			if (
				(other.body &&
					other.body.velocity &&
					other.body.velocity.distance(Phaser.Math.Vector2.ZERO) < 300) || // Check if it's been at least 500 milliseconds since the last hit
				new Date().getTime() - this.lastHit.getTime() < 500
			) {
				// If the ball is not moving, do not apply any force
				return;
			}
			// If the other sprite is a player, increase the collision count
			this.collisionCount++;
			this.lastHit = new Date(); // Update the last hit time
			EventBus.emit("ballHitPlayer", this.collisionCount);
			return;
		}
	}

	public resetHitCounter(): void {
		// Use both EventBus and scene events for compatibility
		EventBus.emit("ballHitGround", this.collisionCount);
		this.collisionCount = 0;
	}
}
