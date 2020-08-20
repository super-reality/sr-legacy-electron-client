// import store from "../redux/stores/renderer";
// import reduxAction from "../redux/reduxAction";

import { AxiosResponse } from "axios";
import SignUp from "./types/auth/signup";
import { ApiError } from "./types";

export default function handleAuthSignup(
  res: AxiosResponse<SignUp | ApiError>
) {
  console.log(res);
  if (res.status === 200) {
    // All ok!
  }
  // Force login, we dont know the response form yet
  // reduxAction(store.dispatch, { type: "AUTH_SUCCESSFUL", arg: "" });
}
