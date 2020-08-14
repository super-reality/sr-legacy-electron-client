// import store from "../redux/stores/renderer";
// import reduxAction from "../redux/reduxAction";

import SignUp from "./types/auth/signup";
import { ApiError } from "./types";

export default function handleAuthSignup(res: SignUp | ApiError) {
  console.log(res);
  if (res.err_code === 0) {
    // All ok!
  }
  // Force login, we dont know the response form yet
  // reduxAction(store.dispatch, { type: "AUTH_SUCCESSFUL", arg: "" });
}
