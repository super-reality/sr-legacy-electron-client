import React, { useCallback, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./index.scss";
import "../../components/buttons.scss";
import { AppState } from "../../redux/stores/renderer";
import ButtonSimple from "../../components/button-simple";
import { API_URL } from "../../constants";
import handleAuthLogin from "../../api/handleAuthSignin";
import handleAuthSingup from "../../api/handleAuthSignup";
import handleAuthError from "../../api/handleAuthError";
import { ApiError } from "../../api/types";
import SignUp from "../../api/types/auth/signup";
import SignIn from "../../api/types/auth/signin";

export default function Auth(): JSX.Element {
  const { isPending } = useSelector((state: AppState) => state.auth);
  const [page, setPage] = useState<"login" | "register">("login");

  const togglePage = useCallback(() => {
    setPage(page == "login" ? "register" : "login");
  }, [page]);

  const usernameField = useRef<HTMLInputElement | null>(null);
  const passwordField = useRef<HTMLInputElement | null>(null);
  const registerFirstnameFiled = useRef<HTMLInputElement | null>(null);
  const registerLastnameField = useRef<HTMLInputElement | null>(null);
  const registerEmailField = useRef<HTMLInputElement | null>(null);
  const registerPasswordField = useRef<HTMLInputElement | null>(null);
  const registerCodeField = useRef<HTMLInputElement | null>(null);

  const handleLoginSubmit = useCallback(() => {
    const payload = {
      username: usernameField.current?.value,
      password: passwordField.current?.value,
    };

    axios
      .post<SignIn | ApiError>(`${API_URL}auth/signin`, payload)
      .then((res) => handleAuthLogin(res))
      .catch(handleAuthError);
  }, []);

  const handleSingupSubmit = useCallback(() => {
    const payload = {
      username: registerEmailField.current?.value,
      firstname: registerFirstnameFiled.current?.value,
      lastname: registerLastnameField.current?.value,
      invitecode: registerCodeField.current?.value,
      password: registerPasswordField.current?.value,
    };

    axios
      .post<SignUp | ApiError>(`${API_URL}auth/signup`, payload)
      .then((res) => handleAuthSingup(res))
      .catch(handleAuthError);
  }, []);

  return (
    <div className="auth-container">
      <div>
        {page == "login" ? (
          <form onSubmit={handleLoginSubmit}>
            <fieldset>
              <legend>Sign in</legend>
              <div className="input-container">
                <label>Username</label>
                <input
                  ref={usernameField}
                  type="text"
                  placeholder="username"
                  disabled={isPending}
                />
              </div>
              <div className="input-container">
                <label>Password</label>
                <input
                  ref={passwordField}
                  type="password"
                  placeholder="password"
                  disabled={isPending}
                />
              </div>
              <div style={{ marginTop: "16px" }}>
                <button
                  className="button-login"
                  type="submit"
                  disabled={isPending}
                >
                  Sign in
                </button>
              </div>
            </fieldset>
          </form>
        ) : (
          <form onSubmit={handleSingupSubmit}>
            <fieldset>
              <legend>Sign up</legend>
              <div className="input-container">
                <label>First Name</label>
                <input
                  ref={registerFirstnameFiled}
                  type="text"
                  placeholder="first name"
                  disabled={isPending}
                />
              </div>
              <div className="input-container">
                <label>Last Name</label>
                <input
                  ref={registerLastnameField}
                  type="text"
                  placeholder="last name"
                  disabled={isPending}
                />
              </div>
              <div className="input-container">
                <label>Email</label>
                <input
                  ref={registerEmailField}
                  type="email"
                  placeholder="email@adress.com"
                  disabled={isPending}
                />
              </div>
              <div className="input-container">
                <label>Password</label>
                <input
                  ref={registerPasswordField}
                  type="password"
                  placeholder=""
                  disabled={isPending}
                />
              </div>
              <div className="input-container">
                <label>Input Code</label>
                <input
                  ref={registerCodeField}
                  type="text"
                  placeholder="invite code"
                  disabled={isPending}
                />
              </div>
              <div style={{ marginTop: "16px" }}>
                <button
                  className="button-login"
                  type="submit"
                  disabled={isPending}
                >
                  Sign Up
                </button>
              </div>
            </fieldset>
          </form>
        )}
        <ButtonSimple onClick={togglePage}>
          {page == "login" ? "Dont have an account? Sign up!" : "Log in"}
        </ButtonSimple>
      </div>
    </div>
  );
}
