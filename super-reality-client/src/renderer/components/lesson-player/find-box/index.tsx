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
          left: `${pos.x - 3}px`,
          top: `${pos.y - 3}px`,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
          ...style,
        }}
      >
        {type == "anchor" && pos.width > 150 && pos.height > 150 && (
          <AnchorIcon
            fill="var(--color-red)"
            style={{ opacity: 0.66, margin: "auto" }}
          />
        )}
      </div>
    );
  }
);

FindBox.displayName = "FindBox";

export default FindBox;
