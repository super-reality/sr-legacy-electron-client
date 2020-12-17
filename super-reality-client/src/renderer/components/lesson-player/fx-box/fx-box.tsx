/* eslint-disable react/prop-types */
import React, { CSSProperties, useEffect, useRef } from "react";
import sendEffectMessage from "../../../../utils/sendEffectMessage";
import { getEffectById } from "../../../constants";

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
  clickThrough?: boolean;
  callback?: (trigger: number) => void;
}

const FXBox = React.forwardRef<HTMLDivElement, FXBoxProps>(
  (props, forwardedRef) => {
    const { effect, style, pos, clickThrough } = props;
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const srcFX = getEffectById(effect);

    /*
    // We should send all required parameters to the component when it loads
    useEffect(() => {
      setTimeout(() => {
        if (iframeRef.current) {
          sendEffectMessage(iframeRef.current, {
            type: "SET_BOOL_PARAMETER",
            payload: {
              name: "bool",
              value: true,
            },
          });
        }
      }, 10);
    }, [iframeRef]);
    */

    return (
      <>
        <div
          ref={forwardedRef}
          className={`fx-box ${clickThrough ? "click-through" : ""}`}
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            width: `${pos.width}px`,
            height: `${pos.height}px`,
            ...style,
          }}
        >
          <iframe ref={iframeRef} className="fx-iframe" src={srcFX?.url} />
        </div>
      </>
    );
  }
);

FXBox.displayName = "FXBox";

export default FXBox;
