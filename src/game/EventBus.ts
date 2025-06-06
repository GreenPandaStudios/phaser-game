import { Events } from "phaser";

// Used to emit events between components, HTML and Phaser scenes
const EventBus = new Events.EventEmitter();

export const RegisterEvent = <T>(
	name: EventName,
	callback: (eventData: T) => void
) => {
	EventBus.on(name, callback);
};

export const EmitEvent = <T>(name: EventName, data: T) => {
	EventBus.emit(name, data);
};

type EventName = "scored" | "gameOver" | "current-scene-ready";

interface Event<T> {
	name: EventName;
	data: T;
}

export interface ScoredEvent extends Event<number> {
	name: "scored";
	data: number;
}

export interface GameOverEvent extends Event<number> {
	name: "gameOver";
	data: number;
}

export interface SceneReadyEvent extends Event<Phaser.Scene> {
	name: "current-scene-ready";
	data: Phaser.Scene;
}

export const RemoveEvent = <T>(
	name: EventName,
	callback?: (eventData: T) => void
) => {
	EventBus.removeListener(name, callback);
};
