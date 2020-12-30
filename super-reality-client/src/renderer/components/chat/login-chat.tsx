import React, { useState } from "react";
import { useDispatch } from "react-redux";
import reduxAction from "../../redux/reduxAction";
import ButtonSimple from "../button-simple";
import client from "./feathers";

export default function Login() {
  // const { isChatAuth } = useSelector((state: AppState) => state.chat);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const handleEmailChange = (ev: any) => {
    setEmail(ev.target.value);
    console.log(ev.target.value);
  };
  const handlePasswordChange = (ev: any) => {
    setPassword(ev.target.value);
  };

  const loginChat = async () => {
    if (email !== "" && password !== "") {
      (client as any)
        .authenticate({
          strategy: "local",
          email,
          password,
        })
        .then(() => {
          reduxAction(dispatch, { type: "LOGIN_CHAT_SUCCES", arg: null });
        })
        .catch((error: any) => {
          console.log("chat local login error", error);
        });
    }
    try {
      await (client as any).reAuthenticate();
      reduxAction(dispatch, { type: "LOGIN_CHAT_SUCCES", arg: null });
    } catch (err) {
      console.log("chat jwt", err);
      reduxAction(dispatch, { type: "LOGIN_CHAT_ERROR", arg: null });
    }
  };

  // const login = () => {
  //   if (email !== "" && password !== "") {
  //     (client as any)
  //       .authenticate({
  //         strategy: "local",
  //         email,
  //         password,
  //       })
  //       .catch((error: any) => {
  //         console.log("local auth", error);

  //     })
  //   }
  //   (client as any).reAuthenticate();
  // };

  const signup = () => {
    return client
      .service("users")
      .create({ email, password })
      .then(() => loginChat());
  };

  return (
    <main>
      <div>
        <div>
          <h2>Login Chat Using the chat email and password or </h2>
          <h2>Signup Chat Using the SR email and password</h2>
        </div>
      </div>
      <div>
        <div>
          <form>
            <fieldset>
              <input
                value={email}
                className="block"
                type="email"
                name="email"
                onChange={(e) => {
                  handleEmailChange(e);
                }}
              />
            </fieldset>

            <fieldset>
              <input
                value={password}
                className="block"
                type="password"
                name="password"
                onChange={(e) => {
                  handlePasswordChange(e);
                }}
              />
            </fieldset>

            <ButtonSimple
              onClick={() => {
                loginChat();
              }}
            >
              Log in
            </ButtonSimple>

            <ButtonSimple
              onClick={() => {
                signup();
              }}
            >
              Signup
            </ButtonSimple>
          </form>
        </div>
      </div>
    </main>
  );
}
