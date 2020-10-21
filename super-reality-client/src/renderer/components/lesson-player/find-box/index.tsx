/* eslint-disable react/prop-types */
import React, { CSSProperties } from "react";
import { ReactComponent as AnchorIcon } from "../../../../assets/svg/anchor.svg";
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
  type: FindBoxType;
  ref?: React.RefObject<HTMLDivElement>;
}

const FindBox = React.forwardRef<HTMLDivElement, FindBoxProps>(
  (props, forwardedRef) => {
    const { type, pos, style } = props;
    console.log(pos);

    return (
      <div
        ref={forwardedRef}
        className={`find-box ${type}`}
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
