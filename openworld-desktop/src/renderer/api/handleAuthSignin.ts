import { AxiosResponse } from "axios";
import store from "../redux/stores/renderer";
import reduxAction from "../redux/reduxAction";
import SignIn from "./types/auth/signin";
import { ApiError } from "./types";

export default function handleAuthSignin(
  res: AxiosResponse<ApiError | SignIn>
): void {
  if (res.status === 200) {
    if (res.data.err_code === 0) {
      window.localStorage.setItem("username", res.data.user.username);
      if (res.data.token) {
        window.localStorage.setItem("token", res.data.token);
      }
      reduxAction(store.dispatch, {
        type: "AUTH_SUCCESSFUL",
        arg: res.data,
      });
      return;
    }
  }
  reduxAction(store.dispatch, {
    type: "AUTH_FAILED",
    arg: null,
  });
}
