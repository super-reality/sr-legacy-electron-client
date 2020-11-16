/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import React, { CSSProperties } from "react";
import { ReactComponent as AnchorIcon } from "../../../../assets/svg/anchor.svg";
import "./index.scss";

interface AnchorBoxProps {
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: CSSProperties;
  clickThrough?: boolean;
  ref?: React.RefObject<HTMLDivElement>;
}

const AnchorBox = React.forwardRef<HTMLDivElement, AnchorBoxProps>(
  (props, forwardedRef) => {
    const { pos, style, clickThrough } = props;

    return (
      <div
        ref={forwardedRef}
        className={`find-box ${clickThrough ? "click-through" : ""} anchor`}
        style={{
          left: `${pos.x - 3}px`,
          top: `${pos.y - 3}px`,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
          ...style,
        }}
      >
        {pos.width > 150 && pos.height > 150 && (
          <AnchorIcon
            fill="var(--color-red)"
            style={{ opacity: 0.66, margin: "auto" }}
          />
        )}
      </div>
    );
  }
);

AnchorBox.displayName = "AnchorBox";

export default AnchorBox;
