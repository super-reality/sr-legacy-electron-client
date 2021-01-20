/* eslint-disable react/prop-types */
import React from "react";
import { ItemImage } from "../../item";
import "./index.scss";
import { BaseBoxProps } from "../boxes";

const ImageBox = React.forwardRef<HTMLDivElement, BaseBoxProps<ItemImage>>(
  (props, forwardedRef) => {
    const { item, style, pos } = props;

    return (
      <div
        ref={forwardedRef}
        className="image-box click-on"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
          ...style,
        }}
      >
        <img
          style={{
            maxHeight: "100%",
          }}
          src={item.url}
        />
      </div>
    );
  }
);

ImageBox.displayName = "ImageBox";

export default ImageBox;
