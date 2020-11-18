import React, { useCallback } from "react";
import "./index.scss";
import { ReactComponent as ButtonEdit } from "../../../../../assets/svg/edit.svg";

interface EditAnchorButtoProps {
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export default function EditAnchorButton(props: EditAnchorButtoProps) {
  const { pos } = props;

  const onClick = useCallback(() => {
    //
  }, []);

  return (
    <div
      className="edit-anchor-button-hover"
      style={{
        left: `${pos.x - 64}px`,
        top: `${pos.y - 64}px`,
        width: `${pos.width + 128}px`,
        height: `${pos.height + 128}px`,
      }}
    >
      <div className="edit-anchor-button">
        <ButtonEdit
          style={{
            width: "16px",
            height: "16px",
            margin: "auto",
            fill: "var(--color-icon)",
          }}
        />
      </div>
    </div>
  );
}
