import { AxiosResponse } from "axios";
import client from "./feathers";
import store from "../redux/stores/renderer";
import reduxAction from "../redux/reduxAction";

import SignUp from "./types/auth/signup";
import { ApiError } from "./types";

export interface EmailRegistrationForm {
  token: string;
  password: string;
}
// TO DO error handling
export default function handleXRAuthSingup(
  res: AxiosResponse<ApiError | SignUp>,
  password: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    // dispatch(actionProcessing(true));
    if (res.status === 200) {
      if (res.data.err_code === 0) {
        // token is stored in localStorage by the handleAuthSingup
        client
          .service("identity-provider")
          .create({
            token: res.data.token,
            password: password,
            type: "password",
          })
          .then((identityProvider: any) => {
            // Create the REGISTER_USER_BY_EMAIL_SUCCSESS action

            // reduxAction(store.dispatch, {
            //   type: "REGISTER_USER_BY_EMAIL_SUCCSESS",
            //   arg: identityProvider,
            // });

            resolve();
          })
          .catch((err: any) => {
            console.log(err);
            // reduxAction(store.dispatch, {
            //   type: "AUTH_XR_FAILED",
            //   arg: null,
            // });
            // dispatch(registerUserByEmailError(err.message));
            // dispatchAlertError(dispatch, err.message);
            reject();
          });

        // handle XR

        return;
      }
      console.log(res.data.err_code);
    }
  });
}
/*
  client.service('identity-provider').create({
        token: form.token,
        password: form.password,
        type: 'password'
      })
        .then((identityProvider: any) => {
          dispatch(registerUserByEmailSuccess(identityProvider));
          window.location.href = '/auth/confirm';
        })
        .catch((err: any) => {
          console.log(err);
          dispatch(registerUserByEmailError(err.message));
          dispatchAlertError(dispatch, err.message);
        })
        .finally(() => dispatch(actionProcessing(false)));
        */
