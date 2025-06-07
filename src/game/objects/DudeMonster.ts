import { Player } from "./Player";
import { bindTouch } from "../input";

export class DudeMonster extends Player {
	readonly SPEED = 500; // Speed of the monster
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "dude_monster");
		this.speed = this.SPEED; // Set the speed of the monster
		this.maxForce = this.SPEED;
		this.texture.setFilter(Phaser.Textures.FilterMode.NEAREST); // Pixel art filter
		this.setScale(2); // Scale the sprite to 2x its original size
		super.setupAnimations(
			{
				key: "dude_monster_idle",
				frames: scene.anims.generateFrameNumbers("dude_monster_idle"),
				frameRate: 10,
				repeat: -1, // Loop the animation indefinitely
			},
			{
				key: "dude_monster_run",
				frames: scene.anims.generateFrameNumbers("dude_monster_run"),
				frameRate: 10,
				repeat: -1, // Loop the animation indefinitely
			},
			{
				key: "dude_monster_in_air",
				frames: scene.anims.generateFrameNumbers("dude_monster_in_air"),
				frameRate: 1,
				repeat: -1,
				yoyo: true, // Make the jump animation loop up and down
			}
		);
	}

	public override handleInput(): void {
		super.handleInput();

		// Add mobile controls for this game
		bindTouch(this, (touchPositions) => {
			let touchInputVector = new Phaser.Math.Vector2(0, 0);
			let touchIsJumping = false;

			function isOnRightSide(
				touchPosition: Phaser.Math.Vector2,
				width: number
			): boolean {
				return touchPosition.x > 2 * (width / 3);
			}

			function isOnLeftSide(
				touchPosition: Phaser.Math.Vector2,
				width: number
			): boolean {
				return touchPosition.x < width / 3;
			}

			console.log("Touch positions:", touchPositions);

			for (const touchPosition of touchPositions) {
				// If touching on the right side of the screen, move right
				if (isOnLeftSide(touchPosition, this.scene.cameras.main.width)) {
					touchInputVector.add(Phaser.Math.Vector2.LEFT); // Move left
				}
				// If touching on the right side of the screen, move right
				else if (isOnRightSide(touchPosition, this.scene.cameras.main.width)) {
					touchInputVector.add(Phaser.Math.Vector2.RIGHT); // Move right
				} else {
					touchIsJumping = true; // If touching in the middle, jump
				}
			}

			// Normalize the vector to ensure consistent speed
			if (touchInputVector.length() > 0) {
				touchInputVector = touchInputVector.normalize();
			}
			// Set the input vector to the player
			this.inputVector = touchInputVector;

			// If the player is jumping, set the jump state
			if (touchIsJumping) {
				if (!this.isOnGround) {
					this.holdingJump = true; // Set holding jump to true
				} else {
					this.jump(); // Jump if on the ground
				}
			} else {
				this.holdingJump = false; // Reset holding jump if not jumping
			}
		});
	}

	/**
	 * Preload the assets for the Dude_Monster player.
	 */
	public static override preload(scene: Phaser.Scene): void {
		console.log("Preloading Dude_Monster assets");
		scene.load.image(
			"dude_monster",
			"/gameAssets/Players/Dude_Monster/Dude_Monster.png"
		);
		scene.load.spritesheet(
			"dude_monster_idle",
			"/gameAssets/Players/Dude_Monster/Dude_Monster_Idle_4.png",
			{
				frameWidth: 32,
				frameHeight: 32,
				endFrame: 3, // Assuming there are 4 frames (0-3)
			}
		);
		scene.load.spritesheet(
			"dude_monster_run",
			"/gameAssets/Players/Dude_Monster/Dude_Monster_Run_6.png",
			{
				frameWidth: 32,
				frameHeight: 32,
				endFrame: 5, // Assuming there are 6 frames (0-5)
			}
		);

		scene.load.spritesheet(
			"dude_monster_in_air",
			"/gameAssets/Players/Dude_Monster/Dude_Monster_Jump_8.png",
			{
				frameWidth: 32,
				frameHeight: 32,
				endFrame: 6, // Assuming there are 4 frames (0-3)
				startFrame: 4,
			}
		);
	}
}
