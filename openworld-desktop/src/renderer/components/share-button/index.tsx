import React, {CSSProperties} from "react";
import "../buttons.scss";

import {ReactComponent as ShareIcon} from "../../../assets/svg/share.svg";

interface Shareprops {
  style?: CSSProperties;
  callback?: () => void;
}

export default function ShareButton(props: Shareprops): JSX.Element {
  return (
    <div
      className="icon-button"
      style={{...props.style, display: "flex", width: "26px", height: "26px"}}
      onClick={props.callback}
    >
      <ShareIcon fill="var(--color-text)" style={{margin: "auto"}} />
    </div>
  );
}
