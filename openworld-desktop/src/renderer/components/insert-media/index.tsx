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
  keepSize?: boolean;
}

export default function InsertMedia(props: InsertMediaProps): JSX.Element {
  const { callback, imgUrl, style, snip, keepSize } = props;
  const call = useCallback(callback, [callback]);

  const openSnipTool = snip
    ? useMediaSniper(imgUrl, call)
    : useMediaInsert(call);

  return (
    <div
      className="insert-media-container"
      style={{
        ...style,
        backgroundImage: keepSize ? `url(${imgUrl})` : "",
      }}
      onClick={openSnipTool}
    >
      {imgUrl ? (
        !keepSize && <img src={imgUrl} />
      ) : (
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
