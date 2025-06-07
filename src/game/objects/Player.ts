import Phaser from "phaser";
import { bindManyKeysToVector, bindManyKeys } from "../input";

export class Player extends Phaser.Physics.Arcade.Sprite {
	protected speed: number = 300;
	protected maxForce: number = 1000;
	protected inputVector: Phaser.Math.Vector2 = new Phaser.Math.Vector2();
	protected jumpHeight: number = 300; // Default jump height
	protected isOnGround: boolean = false; // Track if the player is on the ground
	protected holdingJump: boolean = false; // Track if the jump key is being held down

	private player_idle: Phaser.Animations.Animation | undefined;
	private player_running: Phaser.Animations.Animation | undefined;
	private player_in_air: Phaser.Animations.Animation | undefined;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		texture: string = "player",
		speed: number = 200,
		maxForce: number = 200
	) {
		super(scene, x, y, texture);
		this.speed = speed;
		this.maxForce = maxForce;
		// Add this sprite to the scene
		scene.add.existing(this);

		// Enable physics on this sprite
		scene.physics.add.existing(this, false);

		// Configure the player sprite
		this.setOrigin(0.5, 0.5)
			.setCollideWorldBounds(true)
			.setDragY(0)
			.setMaxVelocity(this.speed * 2, this.speed * 2);

		// Add this player instance to the scene's update list
		scene.events.on("update", (time: number, delta: number) => {
			this.update(time, delta);
		});

		// Give the player a capsule shape for collision
		this.setSize(16, 30); // Adjust size as needed

		this.handleInput();
	}
	/**
	 * Handle input for the player.
	 */

	protected handleInput(): void {
		// Add WASD controls
		bindManyKeysToVector(
			this,
			[
				{
					up: Phaser.Input.Keyboard.KeyCodes.W,
					down: Phaser.Input.Keyboard.KeyCodes.S,
					left: Phaser.Input.Keyboard.KeyCodes.A,
					right: Phaser.Input.Keyboard.KeyCodes.D,
				},
				{
					up: Phaser.Input.Keyboard.KeyCodes.UP,
					down: Phaser.Input.Keyboard.KeyCodes.DOWN,
					left: Phaser.Input.Keyboard.KeyCodes.LEFT,
					right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
				},
			],
			(setTo: Phaser.Math.Vector2) => {
				this.inputVector = setTo;
			}
		);

		bindManyKeys(
			this,
			[
				Phaser.Input.Keyboard.KeyCodes.SPACE,
				Phaser.Input.Keyboard.KeyCodes.W,
				Phaser.Input.Keyboard.KeyCodes.UP,
			],
			(isDown) => {
				this.holdingJump = isDown; // Track if the jump key is held down
				if (isDown) {
					this.jump();
				}
			}
		);
	}

	/**
	 * Update the player state based on input and physics.
	 * @param t - The current time in milliseconds.
	 * @param dt - The delta time since the last update in milliseconds.
	 */

	update(t: number, dt: number): void {
		super.update(t, dt);
		// Update the player's position based on input
		this.setAccelerationX(
			this.inputVector.x * this.maxForce * dt * (this.isOnGround ? 1.0 : 0.5)
		); // Reduce acceleration in the air

		this.setDragX(
			this.isOnGround ? this.maxForce * this.maxForce : this.maxForce
		); // Reduce drag in the air

		if (this.holdingJump) {
			if (this.isOnGround) {
				this.jump(); // Jump if on the ground
			} else {
				// If holding jump in the air, allow for floating effect on the way down
				if (this.body && this.body.velocity && this.body.velocity.y > 0) {
					this.setVelocityY(
						Phaser.Math.Linear(
							this.body.velocity.y * 0.9,
							this.body.velocity.y,
							0.5
						)
					); // Slow down descent
				}
			}
		}

		this.handleGroundCollision();
		this.setAnimationState();
	}
	/**
	 * Handle jumping logic for the player.
	 * This method is called when the jump key is pressed.
	 */
	protected jump(): void {
		if (!this.isOnGround) {
			return; // Prevent jumping if not on the ground
		}
		this.setVelocityY(-this.jumpHeight); // Adjust value for jump height
	}
	/**
	 * Handle ground collision logic.
	 * This method checks if the player is touching the ground or at the bottom world bound.
	 */
	protected handleGroundCollision(): void {
		// Check if player is touching the ground or at the bottom world bound
		if (this.body?.touching.down || this.body?.blocked.down) {
			this.isOnGround = true; // Player is on the ground
		} else {
			this.isOnGround = false; // Player is in the air
		}
	}
	/**
	 * Handle animations for the player.
	 * This method can be overridden in subclasses to define specific animations.
	 */
	protected setupAnimations(
		player_idle: Phaser.Types.Animations.Animation,
		player_running: Phaser.Types.Animations.Animation,
		player_in_air: Phaser.Types.Animations.Animation
	): void {
		const idleAnim = this.scene.anims.create(player_idle);
		const runningAnim = this.scene.anims.create(player_running);
		const inAirAnim = this.scene.anims.create(player_in_air);

		this.player_idle = idleAnim !== false ? idleAnim : undefined;
		this.player_running = runningAnim !== false ? runningAnim : undefined;
		this.player_in_air = inAirAnim !== false ? inAirAnim : undefined;

		// Set the default animation to idle
		if (this.player_idle) {
			this.play(this.player_idle.key, true);
		}
	}

	private setAnimationState(): void {
		// Handle the flipping of the sprite based on input direction
		if (this.inputVector.x < 0) {
			this.setFlipX(true); // Flip the sprite to face left
		} else if (this.inputVector.x > 0) {
			this.setFlipX(false); // Flip the sprite to face right
		}

		if (this.isOnGround) {
			if (this.inputVector.x !== 0) {
				if (this.player_running) {
					this.play(this.player_running, true);
				}
			} else {
				if (this.player_idle) {
					this.play(this.player_idle, true);
				}
			}
		} else {
			if (this.player_in_air) {
				this.play(this.player_in_air, true);
			}
		}
	}

	/**
	 * Preload the assets for the Player.
	 * This method can be overridden in subclasses to load specific player assets.
	 * @param scene - The Phaser scene where the assets will be loaded.
	 */

	// Preload method is empty, but can be overridden in subclasses
	public static preload(_scene: Phaser.Scene): void {}
}
