/* eslint-disable react/prop-types */
import React, { useRef } from "react";
import { getEffectById } from "../../../constants";
import { ItemFX } from "../../item";
import { BaseBoxProps } from "../boxes";

import "./index.scss";

const FXBox = React.forwardRef<HTMLDivElement, BaseBoxProps<ItemFX>>(
  (props, forwardedRef) => {
    const { item, style, pos, clickThrough } = props;
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const srcFX = getEffectById(item.effect);

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
