import { combineReducers } from "redux";
import alerts from "./reducers/alerts";
import auth from "./reducers/auth";
import classrooms from "./reducers/classrooms";
import users from "./reducers/users";

const app = combineReducers({alerts, auth, classrooms, users});

export default app
