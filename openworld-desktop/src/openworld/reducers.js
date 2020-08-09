import { combineReducers } from "redux";
import alerts from "./reducers/alerts";
import auth from "./reducers/auth";
import users from "./reducers/users";

const app = combineReducers({alerts, auth, users});

export default app
