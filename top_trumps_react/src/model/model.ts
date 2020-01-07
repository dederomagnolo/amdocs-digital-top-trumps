export interface Todo {
	id: number;
	text: string;
	completed: boolean;
}

export interface Card {
	id: number;
	titulo: string;
	image: string;
	description: string;
	attributes: {
		amdocs_usage: number;
		popularity: number;
		adoption_phase: number;
		skill_priority: number;
	};
}

export interface Player {
	id: number;
	player_name: string;
	points: number;
	deck: Card;
}

export enum ActionType {
	ADD_TODO,
	DELETE_TODO,
	COMPLETE_TODO,
	UNCOMPLETE_TODO,
	SET_CARD,
	ADD_CARD,
	SET_PLAYER,
	SET_PLAYER_POINTS,
	SET_PLAYER_NAME,
}

export interface Action<T> {
	type: ActionType;
	payload: T;
}
