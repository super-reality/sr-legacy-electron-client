import React, { CSSProperties } from "react";
import "./index.scss";
import Logo from "../../../assets/images/logo-icon.png";

interface ISpinner {
  width: string;
  height?: string;
  style?: CSSProperties;
  text?: string;
}

export default function Spinner(props: ISpinner): JSX.Element {
  const { width, height, style, text } = props;
  return (
    <div className="super-spinner" style={{ ...style, width, height }}>
      <div>
        <img className="rotate" width="100%" src={Logo} />
      </div>
      {text && (
        <div className="super-spinner-text">
          {text}
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      )}
    </div>
  );
}
