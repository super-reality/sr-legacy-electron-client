import { AxiosResponse } from "axios";
import store from "../redux/stores/renderer";
import reduxAction from "../redux/reduxAction";

import SignUp from "./types/auth/signup";
import { ApiError } from "./types";

export default function handleAuthSignup(
  res: AxiosResponse<ApiError | SignUp>
): void {
  if (res.status === 200) {
    if (res.data.err_code === 0) {
      window.localStorage.setItem("username", res.data.user.username);
      window.localStorage.setItem("token", res.data.token);
      reduxAction(store.dispatch, {
        type: "AUTH_SUCCESSFUL",
        arg: res.data,
      });
      return;
    }
    console.log(res.data.err_code);
  }
  reduxAction(store.dispatch, {
    type: "AUTH_FAILED",
    arg: null,
  });
}
