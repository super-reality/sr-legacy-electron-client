import React, { CSSProperties } from "react";
import "./index.scss";

interface InsertMediaProps {
  callback: () => void;
  style?: CSSProperties;
}

export default function InsertMedia(props: InsertMediaProps): JSX.Element {
  const {callback, style} = props;

  return (
    <div className="insert-media-container" style={{...style}} onClick={callback}>
      <div className="insert-media-icon" />
    </div>
  );
}