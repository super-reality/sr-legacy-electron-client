import { CSSProperties } from "react";
import "../buttons.scss";

import { ReactComponent as EditIcon } from "../../../assets/svg/edit.svg";

interface EditProps {
  style?: CSSProperties;
  callback?: () => void;
}

export default function EditButton(props: EditProps): JSX.Element {
  const { style, callback } = props;

  return (
    <div
      className="icon-button"
      style={{
        margin: "auto",
        display: "flex",
        ...style,
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (callback) callback();
      }}
    >
      <EditIcon
        width="20px"
        height="20px"
        fill="var(--color-icon)"
        style={{ margin: "auto" }}
      />
    </div>
  );
}
