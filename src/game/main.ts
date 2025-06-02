import Phaser from "phaser";
import { GameScene } from "./scenes";
const canvasSize = {
	width: 800,
	height: 600,
};

const gravity: Phaser.Types.Math.Vector2Like = {
	x: 0,
	y: 500,
};

function gameConfig(
	debug: boolean = false,
	parent: string
): Phaser.Types.Core.GameConfig {
	return {
		type: Phaser.WEBGL,
		width: canvasSize.width,
		height: canvasSize.height,
		parent,
		physics: {
			default: "arcade",
			arcade: {
				debug,
				gravity,
			},
		},
		render: {
			pixelArt: true,
		},
		scene: [GameScene],
	};
}

export function createGame(parent: string): Phaser.Game {
	return new Phaser.Game(gameConfig(import.meta.env.DEV, parent));
}
