import React, { CSSProperties } from "react";
import "./index.scss";

interface ISupperSpinner {
  size?: string;
  style?: CSSProperties;
  text?: string;
}

export default function SupperSpinner(props: ISupperSpinner): JSX.Element {
  const { size, style, text } = props;
  return (
    <div className="super-spinner-wrapper" style={{ ...style }}>
      <div className="super-spinner">
        <div
          className="spinner-container"
          style={{ width: size, height: size }}
        >
          <div className="rotate spinner-image logo-1" />
          <div className="rotate spinner-image logo-2" />
          <div className="rotate spinner-image logo-3" />
          <div className="rotate spinner-image logo-4" />
          <div className="rotate spinner-image logo-5" />
          <div className="rotate spinner-image logo-6" />
          <div className="rotate spinner-image logo-7" />
          <div className="rotate spinner-image logo-8" />
          <div className="rotate spinner-image logo-9" />
          <div className="rotate spinner-image logo-10" />
          <div className="rotate spinner-image logo-11" />
          <div className="rotate spinner-image logo-12" />
          <div className="rotate spinner-image logo-13" />
          <div className="rotate spinner-image logo-14" />
          <div className="rotate spinner-image logo-15" />
          <div className="rotate spinner-image logo-16" />
          <div className="rotate spinner-image logo-17" />
          <div className="rotate spinner-image logo-18" />
          <div className="rotate spinner-image logo-19" />
          <div className="rotate spinner-image logo-20" />
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
