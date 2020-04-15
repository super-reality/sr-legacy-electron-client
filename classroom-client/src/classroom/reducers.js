import { combineReducers } from "redux";
import auth from "./reducers/auth"
import users from "./reducers/users";

const app = combineReducers({auth, users});

export default app
