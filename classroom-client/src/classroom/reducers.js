import { combineReducers } from "redux";
import auth from "./reducers/auth"

const app = combineReducers({auth});

export default app
