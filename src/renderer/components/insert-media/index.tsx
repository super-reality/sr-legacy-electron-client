import { CSSProperties } from "react";
import { ReactComponent as Add } from "../../../assets/svg/add.svg";
import "./index.scss";
import usePopupImageSource from "../../hooks/usePopupImageSource";

interface InsertMediaProps {
  callback: (url: string) => void;
  imgUrl?: string;
  style?: CSSProperties;
  snip?: boolean;
  url?: boolean;
  disk?: boolean;
  keepSize?: boolean;
}

export default function InsertMedia(props: InsertMediaProps): JSX.Element {
  const { callback, imgUrl, style, snip, url, disk, keepSize } = props;

  const [Popup, open] = usePopupImageSource(
    callback,
    snip || false,
    url || false,
    disk || false,
    false
  );

  return (
    <>
      {Popup}
      <div
        className="insert-media-container"
        style={{
          ...style,
        }}
        onClick={open}
      >
        {imgUrl ? (
          <img
            style={keepSize ? { margin: "0", height: "100%" } : {}}
            src={imgUrl}
          />
        ) : (
          <Add
            style={{ margin: "auto" }}
            fill="var(--color-text)"
            width="12px"
            height="12px"
          />
        )}
      </div>
    </>
  );
}
