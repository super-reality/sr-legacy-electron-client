import store from "../redux/stores/renderer";
import reduxAction from "../redux/reduxAction";
import SignIn from "./types/auth/signin";
import { ApiError } from "./types";

export default function handleAuthLogin(res: ApiError | SignIn) {
  console.log(res);
  if (res.err_code === 0) {
    reduxAction(store.dispatch, { type: "AUTH_SUCCESSFUL", arg: res.token });
  }
}
