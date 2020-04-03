import { combineReducers } from "redux";
import { AUTHENTICATION_SUCCESS, AUTHENTICATION_FAILURE, AUTHENTICATION_ERROR, CLASSES_LOAD_SUCCESS, CLASSES_LOAD_FAILURE, CLASSES_LOAD_ERROR } from "./actions";

const initialState = {
    auth: null,
    classes: null
};

const auth = (state = initialState.auth, action) => {
    switch(action.type) {
        case AUTHENTICATION_SUCCESS:
            return action.payload;
        case AUTHENTICATION_FAILURE:
            return state;
        case AUTHENTICATION_ERROR:
            return state;
        default:
            return state;
    }
};

const classes = (state = initialState.classes, action) => {
    switch(action.type) {
        case CLASSES_LOAD_SUCCESS:
            return action.payload;
        case CLASSES_LOAD_FAILURE:
            return state;
        case CLASSES_LOAD_ERROR:
            return state;
        default:
            return state;
    }
};

const app = combineReducers({ auth, classes });

export default app
