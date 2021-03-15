/* eslint-disable react/prop-types */
import React from "react";
import { ItemImage } from "../../item";
import "./index.scss";
import { BaseBoxProps } from "../boxes";
import useItemBehaviour from "../../useItemBehaviour";

const ImageBox = React.forwardRef<HTMLDivElement, BaseBoxProps<ItemImage>>(
  (props, forwardedRef) => {
    const { item, style, pos, callback } = props;

    const [combinedRef, , , InfoBox] = useItemBehaviour(
      callback,
      forwardedRef,
      true,
      item
    );

    return (
      <div
        ref={combinedRef}
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
        {InfoBox}
      </div>
    );
  }
);

ImageBox.displayName = "ImageBox";

export default ImageBox;
