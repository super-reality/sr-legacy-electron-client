import { AxiosResponse } from "axios";
import client from "./feathers";
import store from "../redux/stores/renderer";
import reduxAction from "../redux/reduxAction";
import SignIn from "./types/auth/signin";
import { ApiError } from "./types";

export default async function handleXRAuthSingin(
  res: AxiosResponse<ApiError | SignIn>
): Promise<any> {
  if (res.status === 200) {
    if (res.data.err_code === 0) {
      const accessToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MDc0NDEyMzQsImV4cCI6MTYxMDAzMzIzNCwic3ViIjoiZDkwNzBmODAtMzk2OS0xMWViLTg4ODAtOGQ5NzEzYzBiNTRkIiwianRpIjoiMTI2NWMwYjEtNjM3Mi00MTFlLWI1MDMtYzY3NTJhOWZjN2EyIn0.-uukMq5GFnRRbedBlXKQfmYmJbiupXpz1cjer6SNya4";
      // window.localStorage.getItem('token');

      let result;
      try {
        result = await (client as any).reAuthenticate();
        console.log("chat auth ok", res);
      } catch (err) {
        console.log(err);
      }

      // (client as any).authentication.setAccessToken(
      //     accessToken as string
      //   );
      return res;
    }
    return res;
  }
  console.log(res.data.err_code);
  return res;
}

function handleAuthSignin(res: AxiosResponse<ApiError | SignIn>): void {
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
