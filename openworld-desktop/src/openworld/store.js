import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import app from "./reducers"

export default createStore(app, applyMiddleware(thunk))
