import { Ball, DudeMonster } from "../objects";

export class GameScene extends Phaser.Scene {
	// Define the scene key
	private static readonly SCENE_KEY: string = "GameScene";

	public getKey(): string {
		return GameScene.SCENE_KEY;
	}

	constructor() {
		super({ key: GameScene.SCENE_KEY });
	}

	preload() {
		this.load.image("background", "/gameAssets/Backgrounds/background.png");
		DudeMonster.preload(this);
		Ball.preload(this); // Assuming Ball is imported from the correct path
	}

	create() {
		this.add.image(0, 0, "background").setOrigin(0.1, 0).setScale(0.5);
		new DudeMonster(this, 400, 200);
		new Ball(this, 300, 300); // Assuming Ball is imported from the correct path
		// Assign to this.player, and DO NOT add .body at the end here
	}

	update(_time: number, _delta: number): void {
		super.update(_time, _delta);
		// Update player with our controls
	}
}
