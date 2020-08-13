import React from "react";
import "./index.scss";
import { useHistory } from "react-router-dom";
import ButtonSimple from "../../components/button-simple";
import topTitle from "../../../assets/images/teacherbot.png";
import splashImage from "../../../assets/images/splash.png";

export default function Splash(): JSX.Element {
  const history = useHistory();

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
        onClick={() => history.push("/auth")}
      >
        Login
      </ButtonSimple>
    </div>
  );
}
