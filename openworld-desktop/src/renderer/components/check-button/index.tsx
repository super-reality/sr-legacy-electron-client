import React, {CSSProperties} from "react";
import "../buttons.scss";

import {ReactComponent as CheckIcon} from "../../../assets/svg/checked.svg";

interface Shareprops {
  style?: CSSProperties;
  checked: boolean;
  callback?: () => void;
}

export default function CheckButton(props: Shareprops): JSX.Element {
  return (
    <div
      className="icon-button"
      style={{...props.style, display: "flex", width: "20px"}}
      onClick={props.callback}
    >
      <CheckIcon
        fill={props.checked ? "var(--color-checked)" : "var(--color-text)"}
        style={{margin: "auto"}}
      />
    </div>
  );
}
