import { History } from "history";
import { combineReducers } from "redux";
import { Todo, Card, Player } from "../model";
import * as todoReducer from "./todo";
import * as cardReducer from "./card";
import * as playerReducer from "./player";

export interface RootState {
	todoList: Todo[];
	cardList: Card[];
	playerList: Player[];
}

export default (history: History) =>
	combineReducers({
		...todoReducer,
		...cardReducer,
		...playerReducer,
	});
