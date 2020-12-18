import React, { useCallback, useRef, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import "./index.scss";
import "../../components/buttons.scss";
import { animated, useSpring } from "react-spring";
import { AppState } from "../../redux/stores/renderer";
import ButtonSimple from "../../components/button-simple";
import { API_URL, timeout } from "../../constants";
import handleAuthSignin from "../../api/handleAuthSignin";
import handleAuthSingup from "../../api/handleAuthSignup";
import handleAuthError from "../../api/handleAuthError";
import { ApiError } from "../../api/types";
import SignUp from "../../api/types/auth/signup";
import SignIn from "../../api/types/auth/signin";
import reduxAction from "../../redux/reduxAction";
// import Flex from "../../components/flex";
import handleXRAuthSignup from "../../api/handleXRAuthSignup";
import handleXRAuthSingin from "../../api/handleXRAuthSignin";

interface AuthProps {
  onAuth: () => void;
}

export default function Auth(props: AuthProps): JSX.Element {
  const { onAuth } = props;
  const dispatch = useDispatch();
  const { isPending } = useSelector((state: AppState) => state.auth);

  const [stateSpring, set] = useSpring(
    () =>
      ({
        transform: "translateX(0%)",
      } as any)
  );

  const goSignIn = useCallback(() => {
    set({ transform: "translateX(0%)" });
  }, [set]);

  const goSignUp = useCallback(() => {
    set({ transform: "translateX(-50%)" });
  }, [set]);

  const usernameField = useRef<HTMLInputElement | null>(null);
  const passwordField = useRef<HTMLInputElement | null>(null);
  const registerFirstnameFiled = useRef<HTMLInputElement | null>(null);
  const registerLastnameField = useRef<HTMLInputElement | null>(null);
  const registerEmailField = useRef<HTMLInputElement | null>(null);
  const registerPasswordField = useRef<HTMLInputElement | null>(null);
  const registerCodeField = useRef<HTMLInputElement | null>(null);

  const defaultUser = window.localStorage.getItem("username");
  const defaultToken = window.localStorage.getItem("token");

  useEffect(() => {
    if (defaultToken && defaultUser && passwordField.current) {
      passwordField.current.value = "*";
    }
  }, [passwordField.current]);

  const handleLoginSubmit = useCallback(() => {
    reduxAction(dispatch, { type: "AUTH_PENDING", arg: null });
    if (defaultToken && passwordField.current?.value == "*") {
      reduxAction(dispatch, { type: "AUTH_TOKEN", arg: defaultToken });
      axios
        .post<SignIn | ApiError>(`${API_URL}auth/verify`, null, {
          timeout: timeout,
          headers: {
            Authorization: `Bearer ${defaultToken}`,
          },
        })
        .then((res) => {
          handleXRAuthSingin(res).then((result) => {
            handleAuthSignin(result);
            onAuth();
          });
        })
        .catch(handleAuthError);
    } else {
      const payload = {
        username: usernameField.current?.value,
        password: passwordField.current?.value,
      };

      axios
        .post<SignIn | ApiError>(`${API_URL}auth/signin`, payload, {
          timeout: timeout,
        })
        .then((res) => {
          if (payload.password) {
            handleXRAuthSignup(res, payload.password).then(() => {
              handleAuthSignin(res);
              onAuth();
            });
          }
        })
        .catch(handleAuthError);
    }
  }, []);

  const handleSingupSubmit = useCallback(() => {
    reduxAction(dispatch, { type: "AUTH_PENDING", arg: null });
    const payload = {
      username: registerEmailField.current?.value,
      firstname: registerFirstnameFiled.current?.value,
      lastname: registerLastnameField.current?.value,
      invitecode: registerCodeField.current?.value,
      password: registerPasswordField.current?.value,
    };

    axios
      .post<SignUp | ApiError>(`${API_URL}auth/signup`, payload)
      .then((res) => {
        // register in the XRengine
        if (payload.password) {
          handleXRAuthSignup(res, payload.password)
            .then(() => {
              handleAuthSingup(res);
              onAuth();
            })
            .catch((err) => {
              console.log("auth", err);
            });
        }
      })
      .catch((er) => {
        handleAuthError(er);
      });
  }, []);

  return (
    <animated.div style={stateSpring} className="auth-scroller">
      <form className="auth-container">
        <fieldset>
          <div className="input-container">
            <label>Email</label>
            <input
              ref={usernameField}
              key="singin-username"
              defaultValue={defaultUser || ""}
              type="text"
              placeholder="username"
              disabled={isPending}
            />
          </div>
          <div className="input-container">
            <label>Password</label>
            <input
              ref={passwordField}
              key="singin-password"
              type="password"
              placeholder="password"
              disabled={isPending}
            />
          </div>
        </fieldset>
        <div className="actions-container">
          <ButtonSimple
            className="button-login"
            margin="auto"
            width="calc(50% - 32px)"
            onClick={handleLoginSubmit}
          >
            Sign in
          </ButtonSimple>
          <p>
            Dont have an account? <a onClick={goSignUp}>Create one!</a>
          </p>
        </div>
      </form>
      <form className="auth-container">
        <fieldset>
          <div className="input-container">
            <label>First Name</label>
            <input
              ref={registerFirstnameFiled}
              key="signup-firstname"
              type="text"
              placeholder="first name"
              disabled={isPending}
            />
          </div>
          <div className="input-container">
            <label>Last Name</label>
            <input
              ref={registerLastnameField}
              key="signup-lastname"
              type="text"
              placeholder="last name"
              disabled={isPending}
            />
          </div>
          <div className="input-container">
            <label>Email</label>
            <input
              ref={registerEmailField}
              key="signup-email"
              type="email"
              placeholder="email@adress.com"
              disabled={isPending}
            />
          </div>
          <div className="input-container">
            <label>Password</label>
            <input
              ref={registerPasswordField}
              key="signup-password"
              type="password"
              placeholder=""
              disabled={isPending}
            />
          </div>
          <div className="input-container">
            <label>Input Code</label>
            <input
              ref={registerCodeField}
              key="signup-code"
              type="text"
              placeholder="invite code"
              disabled={isPending}
            />
          </div>
        </fieldset>
        <div className="actions-container">
          <ButtonSimple
            className="button-login"
            margin="auto"
            width="calc(50% - 32px)"
            onClick={handleSingupSubmit}
          >
            Sign up
          </ButtonSimple>
          <p>
            Already have an account? <a onClick={goSignIn}>Sign in!</a>
          </p>
        </div>
      </form>
    </animated.div>
  );
}
