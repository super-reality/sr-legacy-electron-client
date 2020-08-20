/* eslint-disable no-underscore-dangle */
import { AxiosResponse } from "axios";
import store from "../redux/stores/renderer";
import reduxAction from "../redux/reduxAction";
import SignIn from "./types/auth/signin";
import { ApiError } from "./types";

export default function handleAuthSignin(
  res: AxiosResponse<ApiError | SignIn>
) {
  console.log(res);
  if (res.status === 200) {
    if (res.data.err_code === 0) {
      window.localStorage.setItem("username", res.data.user.username);
      window.localStorage.setItem("token", res.data.token);
      reduxAction(store.dispatch, {
        type: "AUTH_SUCCESSFUL",
        arg: res.data,
      });
    }
  }
}
