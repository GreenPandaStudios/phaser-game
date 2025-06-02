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
	canvas: HTMLCanvasElement
): Phaser.Types.Core.GameConfig {
	return {
		type: Phaser.WEBGL,
		width: canvasSize.width,
		height: canvasSize.height,
		canvas,
		physics: {
			default: "arcade",
			arcade: {
				debug,
				gravity,
			},
		},
		scene: [GameScene],
	};
}

export function createGame(canvas: HTMLCanvasElement): Phaser.Game {
	return new Phaser.Game(gameConfig(import.meta.env.DEV, canvas));
}
