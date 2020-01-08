import { Action, ActionType, Card } from "../model";
import createReducer from "./createReducer";

export const cardList = createReducer<Card[]>([], {
	[ActionType.SET_CARD](state: Card[], action: Action<Card>) {
		// search after todo item with the given id and set completed to true
		return state.map(t =>
			t.id === action.payload.id
				? {
						...t,
						titulo: action.payload.titulo,
						image: action.payload.image,
						description: action.payload.description,
						attributes: {
							amdocs_usage:
								action.payload.attributes.amdocs_usage,
							popularity: action.payload.attributes.popularity,
							adoption_phase:
								action.payload.attributes.adoption_phase,
							skill_priority:
								action.payload.attributes.skill_priority,
						},
				  }
				: t
		);
	},
	[ActionType.ADD_CARD](state: Card[], action: Action<Card>) {
		return [...state, action.payload];
	},
});
