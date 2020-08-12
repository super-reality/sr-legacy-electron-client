import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import "./index.scss";
import ButtonSimple from "../../components/button-simple";
import reduxAction from "../../redux/reduxAction";
import topTitle from "../../../assets/images/teacherbot.png";
import splashImage from "../../../assets/images/splash.png";

export default function Splash(): JSX.Element {
  const dispatch = useDispatch();
  const login = useCallback(() => {
    reduxAction(dispatch, { type: "AUTH_SUCCESSFUL", arg: "" });
  }, []);

  return (
    <div className="splash-container">
      <div className="splash-image">
        <img src={topTitle} />
      </div>
      <div className="splash-image">
        <img src={splashImage} />
      </div>
      <ButtonSimple
        margin="16px auto"
        style={{
          maxWidth: "200px",
          height: "40px",
          width: "-webkit-fill-available",
        }}
        onClick={login}
      >
        Login
      </ButtonSimple>
    </div>
  );
}
