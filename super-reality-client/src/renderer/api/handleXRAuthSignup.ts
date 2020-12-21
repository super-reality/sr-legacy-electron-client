import { AxiosResponse } from "axios";
import client from "../chat/redux/feathers";
// import store from "../redux/stores/renderer";
// import reduxAction from "../redux/reduxAction";

import SignUp from "./types/auth/signup";
import SignIn from "./types/auth/signin";
import { ApiError } from "./types";

export interface EmailRegistrationForm {
  token: string;
  password: string;
}
// TO DO error handling
export default function handleXRAuthSingup(
  res: AxiosResponse<ApiError | SignUp | SignIn>,
  password: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    // dispatch(actionProcessing(true));
    if (res.status === 200) {
      if (res.data.err_code === 0) {
        const email = window.localStorage.getItem("username");
        if (email) {
          client
            .service("identity-provider")
            .create({
              token: email,
              password: password,
              type: "password",
            })

            .then((resIP: any) => {
              console.log(resIP);
              return client.service("authManagement").create({
                action: "verifySignupLong",
                value: resIP.verifyToken,
              });
            })

            .then((r: any) => {
              console.log(r);
              window.localStorage.setItem(
                "TheOverlay-Auth-Store",
                r.accessToken
              );
              return (client as any).authenticate({
                strategy: "jwt",
                accessToken: r.accessToken,
              });
            })
            .then(() => {
              return (client as any)
                .reAuthenticate()
                .then((result: any) => {
                  console.log("chat auth ok", result);
                  resolve();
                })
                .catch((error: any) => {
                  console.log(
                    "reAuthenticate err, trying to register user after the signup",
                    error
                  );
                });
            })
            .catch((err: any) => {
              console.log(err);

              reject();
            });
        }

        return;
      }
      console.log(res.data.err_code);
    }
  });
}
