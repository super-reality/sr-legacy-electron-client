import React, { useState } from "react";
import client from "./feathers";

export default function Login() {
  const [loginState, setLoginState] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (ev) => {
    setEmail(ev.target.value);
    console.log(ev.target.value);
  };
  const handlePasswordChange = (ev) => {
    setPassword(ev.target.value);
  };
  const login = () => {
    if (email !== "" && password !== "") {
      client
        .authenticate({
          strategy: "local",
          email,
          password,
        })
        .catch((error) => {
          console.log(error);
          setLoginState({ error: error });
        });
    }
    client.authenticate();
  };

  const signup = () => {
    return client
      .service("users")
      .create({ email, password })
      .then(() => login());
  };

  const { error } = loginState;
  return (
    <main className="login container">
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet text-center heading">
          <h1 className="font-100">Log in or signup</h1>
          <p>{error && error.message}</p>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-6-tablet push-3-tablet col-4-desktop push-4-desktop">
          <form className="form">
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

            <button
              type="button"
              className="button button-primary block signup"
              onClick={() => {
                login();
              }}
            >
              Log in
            </button>

            <button
              type="button"
              className="button button-primary block signup"
              onClick={() => {
                signup();
              }}
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
