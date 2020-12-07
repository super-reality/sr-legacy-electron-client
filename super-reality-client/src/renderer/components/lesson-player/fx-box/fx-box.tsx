/* eslint-disable react/prop-types */
import React, { CSSProperties } from "react";
import { effectDB } from "../../../constants";

import "./index.scss";

interface FXBoxProps {
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: CSSProperties;
  effect: string;
  callback?: (trigger: number) => void;
}

const FXBox = React.forwardRef<HTMLDivElement, FXBoxProps>(
  (props, forwardedRef) => {
    const { effect, style, pos, callback } = props;
    const srcFX = effectDB[effect].url;

    return (
      <>
        <div
          ref={forwardedRef}
          className="fx-box click-through"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            width: `${pos.width}px`,
            height: `${pos.height}px`,
            ...style,
          }}
        >
          <iframe className="fx-iframe" src={srcFX} />
        </div>
      </>
    );
  }
);

FXBox.displayName = "FXBox";

export default FXBox;
