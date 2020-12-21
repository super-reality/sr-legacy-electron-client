import { AxiosResponse } from "axios";
import client from "../chat/redux/feathers";
// import store from "../redux/stores/renderer";
// import reduxAction from "../redux/reduxAction";
import SignIn from "./types/auth/signin";
import { ApiError } from "./types";

export default async function handleXRAuthSingin(
  res: AxiosResponse<ApiError | SignIn>
): Promise<any> {
  if (res.status === 200) {
    if (res.data.err_code === 0) {
      //  window.localStorage.getItem('token');
      try {
        const accessToken = window.localStorage.getItem(
          "TheOverlay-Auth-Store"
        );
        console.log(accessToken);
        // await (client as any).authentication.setAccessToken(
        //   accessToken as string
        // );
        let result;
        try {
          result = await (client as any).reAuthenticate();
          console.log("chat auth ok", result);
        } catch (error) {
          console.log("reAuthenticate err, trying to register user", error);
          return error;
          // try {
          //   await (client as any).authentication.setAccessToken(
          //     accessToken as string
          //   );
          // } catch (er) {
          //   console.log("reAuthenticate 2 err", er);
          // }
        }
      } catch (err) {
        console.log("setAccessToken err", err);
      }

      return res;
    }
    return res;
  }
  console.log(res.data.err_code);
  return res;
}

// function handleAuthSignin(res: AxiosResponse<ApiError | SignIn>): void {
//   if (res.status === 200) {
//     if (res.data.err_code === 0) {
//       window.localStorage.setItem("username", res.data.user.username);
//       if (res.data.token) {
//         window.localStorage.setItem("token", res.data.token);
//       }
//       reduxAction(store.dispatch, {
//         type: "AUTH_SUCCESSFUL",
//         arg: res.data,
//       });
//       return;
//     }
//   }
//   reduxAction(store.dispatch, {
//     type: "AUTH_FAILED",
//     arg: null,
//   });
// }