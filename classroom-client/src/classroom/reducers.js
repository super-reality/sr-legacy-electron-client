import { combineReducers } from "redux"
import { UPDATE_MESSAGE } from "./actions"

function message(state = "Hello, React!", action) {
    switch(action.type) {
        case UPDATE_MESSAGE:
            return action.message;
        default:
            return state;
    }
}

const app = combineReducers({ message });

export default app
