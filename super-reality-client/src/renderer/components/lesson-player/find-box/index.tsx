/* eslint-disable react/prop-types */
import React, { CSSProperties } from "react";
import { ReactComponent as AnchorIcon } from "../../../../assets/svg/anchor.svg";
import { ItemFocus } from "../../../api/types/item/item";
import "./index.scss";

export type FindBoxType = "anchor" | "target";

interface FindBoxProps {
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: CSSProperties;
  type: ItemFocus["focus"] | "anchor";
  ref?: React.RefObject<HTMLDivElement>;
}

const FindBox = React.forwardRef<HTMLDivElement, FindBoxProps>(
  (props, forwardedRef) => {
    const { type, pos, style } = props;

    let computedType = "type";
    if (type == "anchor") computedType = "anchor";
    if (type == "Mouse Point") computedType = "mouse";
    if (type == "Rectangle") computedType = "rectangle";
    if (type == "Area highlight") computedType = "area";

    return (
      <div
        ref={forwardedRef}
        className={`find-box ${computedType}`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${pos.width - 6}px`,
          height: `${pos.height - 6}px`,
          ...style,
        }}
      >
        {type == "anchor" && (
          <AnchorIcon fill="var(--color-red)" style={{ margin: "auto" }} />
        )}
      </div>
    );
  }
);

FindBox.displayName = "FindBox";

export default FindBox;
