import React, { CSSProperties } from "react";
import { ReactComponent as Add } from "../../../assets/svg/add.svg";

import "./index.scss";

interface InsertMediaProps {
  callback: () => void;
  imgUrl?: string;
  style?: CSSProperties;
}

export default function InsertMedia(props: InsertMediaProps): JSX.Element {
  const { callback, imgUrl, style } = props;

  return (
    <div
      className="insert-media-container"
      style={{ ...style, backgroundImage: `url(${imgUrl})` }}
      onClick={callback}
    >
      {imgUrl ? undefined : (
        <Add
          style={{ margin: "auto" }}
          fill="var(--color-text)"
          width="30px"
          height="30px"
        />
      )}
    </div>
  );
}
