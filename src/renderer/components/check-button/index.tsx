import { CSSProperties } from "react";
import "../buttons.scss";

import { ReactComponent as UncheckIcon } from "../../../assets/svg/unchecked.svg";
import { ReactComponent as CheckIcon } from "../../../assets/svg/checked.svg";

interface Shareprops {
  style?: CSSProperties;
  checked: boolean;
  callback?: () => void;
}

export default function CheckButton(props: Shareprops): JSX.Element {
  const { style, checked, callback } = props;

  return (
    <div
      className="icon-button"
      style={{ ...style, display: "flex", width: "20px", height: "20px" }}
      onClick={(e) => {
        e.stopPropagation();
        if (callback) callback();
      }}
    >
      {checked ? (
        <CheckIcon
          fill={checked ? "var(--color-checked)" : "var(--color-text)"}
          width="20px"
          height="20px"
          style={{ margin: "auto" }}
        />
      ) : (
        <UncheckIcon
          fill={checked ? "var(--color-checked)" : "var(--color-text)"}
          width="20px"
          height="20px"
          style={{ margin: "auto" }}
        />
      )}
    </div>
  );
}
