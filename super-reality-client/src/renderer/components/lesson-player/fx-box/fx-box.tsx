/* eslint-disable react/prop-types */
import React, { CSSProperties, useEffect, useRef } from "react";
import { TypeToMessage } from "../../../../types/effects";
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
  parameters: Record<string, any>;
  style?: CSSProperties;
  effect: string;
  clickThrough?: boolean;
  callback?: (trigger: number) => void;
}

const FXBox = React.forwardRef<HTMLDivElement, FXBoxProps>(
  (props, forwardedRef) => {
    const { effect, style, pos, clickThrough, parameters } = props;
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const srcFX = getEffectById(effect);

    // We should send all required parameters to the component when it loads
    useEffect(() => {
      setTimeout(() => {
        Object.keys(parameters).forEach((name) => {
          const value = parameters[name];
          const type = srcFX?.parameters.filter((p) => p.name == name)[0];
          if (iframeRef.current && type) {
            sendEffectMessage(iframeRef.current, {
              type: TypeToMessage[type.type],
              payload: {
                name: name,
                value: value,
              },
            });
          }
        });
      }, 10);
    }, [parameters, iframeRef]);

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
