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
    <div className="super-spinner-wrapper">
      <div className="super-spinner" style={{ ...style, width, height }}>
        <div className="spinner-container">
          <img className="rotate logo-1" width="100%" src={Logo} />
          <img className="rotate logo-2" width="100%" src={Logo} />
          <img className="rotate logo-3" width="100%" src={Logo} />
          <img className="rotate logo-4" width="100%" src={Logo} />
          <img className="rotate logo-5" width="100%" src={Logo} />
          <img className="rotate logo-6" width="100%" src={Logo} />
          <img className="rotate logo-7" width="100%" src={Logo} />
          <img className="rotate logo-8" width="100%" src={Logo} />
          <img className="rotate logo-9" width="100%" src={Logo} />
          <img className="rotate logo-10" width="100%" src={Logo} />
          <img className="rotate logo-11" width="100%" src={Logo} />
          <img className="rotate logo-12" width="100%" src={Logo} />
          <img className="rotate logo-13" width="100%" src={Logo} />
          <img className="rotate logo-14" width="100%" src={Logo} />
          <img className="rotate logo-15" width="100%" src={Logo} />
          <img className="rotate logo-16" width="100%" src={Logo} />
          <img className="rotate logo-17" width="100%" src={Logo} />
          <img className="rotate logo-18" width="100%" src={Logo} />
          <img className="rotate logo-19" width="100%" src={Logo} />
          <img className="rotate logo-20" width="100%" src={Logo} />
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
    </div>
  );
}
