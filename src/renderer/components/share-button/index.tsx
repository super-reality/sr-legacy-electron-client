import { CSSProperties } from "react";
import "../buttons.scss";

import { ReactComponent as ShareIcon } from "../../../assets/svg/share.svg";

interface Shareprops {
  style?: CSSProperties;
  callback?: () => void;
}

export default function ShareButton(props: Shareprops): JSX.Element {
  const { style, callback } = props;

  return (
    <div
      className="icon-button"
      style={{ ...style, display: "flex", width: "26px", height: "26px" }}
      onClick={(e) => {
        e.stopPropagation();
        if (callback) callback();
      }}
    >
      <ShareIcon fill="var(--color-text)" style={{ margin: "auto" }} />
    </div>
  );
}
