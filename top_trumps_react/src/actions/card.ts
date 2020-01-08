import { Action, ActionType, Card } from "../model";

// Async Function expample with redux-thunk
export function addCard(card: Card) {
	// here you could do API eg

	return (dispatch: Function, getState: Function) => {
		dispatch({ type: ActionType.ADD_CARD, payload: card });
	};
}
