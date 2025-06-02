import { Player } from "../objects";

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
		this.load.image("player", "/gameAssets/Players/mainPlayer.png");
		this.load.image("background", "/gameAssets/Backgrounds/background.png");
	}

	create() {
		this.add.image(400, 300, "background").setOrigin(0.5, 0.5);
		// Assign to this.player, and DO NOT add .body at the end here
		new Player(this, 300, 300, "player"); // Initial position
	}

	update(_time: number, _delta: number): void {
		super.update(_time, _delta);
		// Update player with our controls
	}
}
