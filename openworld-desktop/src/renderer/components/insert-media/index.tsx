import React, { CSSProperties } from "react";
import { ReactComponent as Add } from "../../../assets/svg/add.svg";

import "./index.scss";

interface InsertMediaProps {
  callback: () => void;
  style?: CSSProperties;
}

export default function InsertMedia(props: InsertMediaProps): JSX.Element {
  const { callback, style } = props;

  return (
    <div
      className="insert-media-container"
      style={{ ...style }}
      onClick={callback}
    >
      <Add
        style={{ margin: "auto" }}
        fill="var(--color-text)"
        width="30px"
        height="30px"
      />
    </div>
  );
}
