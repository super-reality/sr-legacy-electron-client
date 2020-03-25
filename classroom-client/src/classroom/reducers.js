import {INITIALIZE_USERS, USER_CONNECTED, USER_DISCONNECTED} from "./actions"
import {combineReducers} from "redux";

const initialState = {
    users: []
};

const users = (state = initialState.users, action) => {
    switch(action.type) {
        case INITIALIZE_USERS:
            return action.users;
        case USER_CONNECTED:
            return [...state, action.user];
        case USER_DISCONNECTED:
            return state.filter(user => user !== action.user);
        default:
            return state;
    }
};

const app = combineReducers({ users });

export default app
