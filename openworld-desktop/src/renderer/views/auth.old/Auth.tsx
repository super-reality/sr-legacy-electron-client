import React, { useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../redux/stores/renderer";

export default function Auth(): JSX.Element {
  const usernameField = useRef<null | HTMLInputElement>(null);
  const passwordField = useRef<null | HTMLInputElement>(null);
  // const dispatch = useDispatch();
  // const history = useHistory();
  // const location = useLocation();
  // const isAuthenticated = useSelector((state: AppState) => state.auth.isValid);
  const isPending = useSelector((state: AppState) => state.auth.isPending);

  const focusField = useCallback(
    (fieldRef: React.MutableRefObject<HTMLInputElement | null>): void =>
      fieldRef.current?.focus() || undefined,
    []
  );

  /*
  const authenticate = useCallback(
    (username, password) => {
      reduxAction(dispatch, { type: "AUTH_PENDING", arg: false });
      return Axios.post(
        "http://localhost:3000/api/v1/auth/new",
        { username, password },
        { timeout: 3000 }
      )
        .then((response) => {
          const { token } = response.data;
          return localForage
            .setItem("com.gamegen.classroom.auth.token", token)
            .then((value) => Promise.resolve(value))
            .catch((error) => Promise.reject(error));
        })
        .then((token) => {
          reduxAction(dispatch, { type: "AUTH_SUCCESSFUL", arg: token });
          return Promise.resolve();
        })
        .catch((error) => {
          reduxAction(dispatch, { type: "AUTH_FAILED", arg: false });
          return Promise.reject(error);
        });
    },
    [dispatch]
  );
  */

  /*
  const redirect = () => history.replace(location.state ? location.state.redirect : "/");

  const onFormSubmit = (event) => {
    event.preventDefault();

    authenticate(
      usernameField?.current?.value || "",
      passwordField?.current?.value || ""
    )
      .then(() => redirect())
      .catch((error) => receiveAlert(ALERT_STATUS_ERROR, error.message));
  };

  useEffect(() => {
    if (isAuthenticated) {
      redirect();
    }
  });
  */
  return (
    <form>
      <fieldset>
        <legend>sign in</legend>
        <div>
          <label onClick={() => focusField(usernameField)}>username</label>
          <input
            ref={usernameField}
            type="text"
            placeholder="username"
            disabled={isPending}
          />
        </div>
        <div>
          <label onClick={() => focusField(passwordField)}>password</label>
          <input
            ref={passwordField}
            type="password"
            placeholder="password"
            disabled={isPending}
          />
        </div>
        <div>
          <input type="submit" value="sign in" disabled={isPending} />
        </div>
      </fieldset>
    </form>
  );
}
