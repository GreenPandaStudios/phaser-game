import Phaser from "phaser";
import { Player } from "./Player";
import { EmitEvent } from "../EventBus";

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
		this.setFriction(0);
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
		up: boolean,
		down: boolean,
		left: boolean,
		right: boolean
	): void {
		if (down) {
			this.resetHitCounter();
		}
		if (up || left || right) {
			this.handleScored();
		}
	}

	public handleCollision(other: Phaser.Physics.Arcade.Sprite): void {
		// If the ball is on the ground, apply a small upward force
		const otherSprite = other as Phaser.Physics.Arcade.Sprite;

		const isBallMovingFast = this.body && this.body.velocity.length() > 300;
		const isOtherMovingFast =
			otherSprite.body && otherSprite.body.velocity.length() > 300;

		if (other instanceof Player) {
			if (
				!(isOtherMovingFast || isBallMovingFast) || // Check if the other sprite is not moving fast
				new Date().getTime() - this.lastHit.getTime() < 400
			) {
				// If the ball is not moving, do not apply any force
			} else {
				// If the other sprite is a player, increase the collision count
				this.handleScored();
			}
		}

		if (isBallMovingFast || isOtherMovingFast) {
			this.setAngularVelocity(
				Phaser.Math.Between(-200, 200) // Random angular velocity for a more dynamic bounce
			);

			if (this.body && otherSprite.body) {
				(this.body as Phaser.Physics.Arcade.Body).setVelocity(
					this.body.velocity.x * 0.75 +
						0.25 * otherSprite.body.velocity.x +
						Phaser.Math.Between(-150, 150),
					this.body.velocity.y * 0.75 -
						Math.max(
							-otherSprite.body.velocity.y,
							Math.abs(otherSprite.body.velocity.x)
						)
				);

				// Apply a small reverse force to the body that hit the ball
				const newVelocity = Phaser.Math.LinearXY(
					otherSprite.body.velocity,
					new Phaser.Math.Vector2(-this.body.velocity.x, -this.body.velocity.y),
					0.3
				);
				(otherSprite.body as Phaser.Physics.Arcade.Body).setVelocity(
					newVelocity.x,
					newVelocity.y
				);
			}
		} else {
			this.setAngularVelocity(0);
		}
	}

	public resetHitCounter(): void {
		// Use both EventBus and scene events for compatibility
		EmitEvent("gameOver", this.collisionCount);
		this.collisionCount = 0;
	}

	public handleScored(): void {
		this.collisionCount++;
		this.lastHit = new Date(); // Update the last hit time
		EmitEvent("scored", this.collisionCount);
	}
}
