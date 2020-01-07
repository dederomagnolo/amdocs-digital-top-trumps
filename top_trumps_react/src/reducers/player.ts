import { Action, ActionType, Player } from "../model";
import createReducer from "./createReducer";

export const playerList = createReducer<Player[]>([], {
	[ActionType.SET_PLAYER](state: Player[], action: Action<Player>) {
		// search after todo item with the given id and set completed to true
		return [...state, action.payload];
	},
	[ActionType.SET_PLAYER_NAME](state: Player[], action: Action<Player>) {
		// search after todo item with the given id and set completed to true
		return state.map(t =>
			t.id === action.payload.id
				? {
						...t,
						player_name: action.payload.player_name,
				  }
				: t
		);
	},
	[ActionType.SET_PLAYER_POINTS](state: Player[], action: Action<Player>) {
		// search after todo item with the given id and set completed to true
		return state.map(t =>
			t.id === action.payload.id
				? {
						...t,
						points: action.payload.points,
				  }
				: t
		);
	},
});
