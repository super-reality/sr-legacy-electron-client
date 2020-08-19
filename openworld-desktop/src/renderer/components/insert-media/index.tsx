import React, { CSSProperties, useCallback } from "react";
import { ReactComponent as Add } from "../../../assets/svg/add.svg";
import "./index.scss";
import useMediaSniper from "../../hooks/useMediaSniper";
import useMediaInsert from "../../hooks/useMediaInsert";

interface InsertMediaProps {
  callback: (url: string) => void;
  imgUrl?: string;
  style?: CSSProperties;
  snip?: boolean;
}

export default function InsertMedia(props: InsertMediaProps): JSX.Element {
  const { callback, imgUrl, style, snip } = props;

  const openSnipTool = snip
    ? useMediaSniper(imgUrl, callback)
    : useMediaInsert(callback);

  return (
    <div
      className="insert-media-container"
      style={{
        ...style,
        backgroundImage: `url(${imgUrl})`,
      }}
      onClick={openSnipTool}
    >
      {imgUrl ? undefined : (
        <Add
          style={{ margin: "auto" }}
          fill="var(--color-text)"
          width="12px"
          height="12px"
        />
      )}
    </div>
  );
}
