/* eslint-disable react/prop-types */
import React from "react";
import { ItemImage, ItemImageTriggers } from "../../item";
import { voidFunction } from "../../../constants";
import ButtonSimple from "../../../components/button-simple";
import "./index.scss";
import { BaseBoxProps } from "../boxes";

const ImageBox = React.forwardRef<HTMLDivElement, BaseBoxProps<ItemImage>>(
  (props, forwardedRef) => {
    const { item, style, pos, callback } = props;

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
            maxHeight: item.trigger ? "calc(100% - 64px)" : "100%",
          }}
          src={item.url}
        />
        {item.trigger && (
          <ButtonSimple
            width="200px"
            height="24px"
            margin="auto"
            onClick={
              callback
                ? () => callback(ItemImageTriggers["Click Ok button"])
                : voidFunction
            }
          >
            Ok
          </ButtonSimple>
        )}
      </div>
    );
  }
);

ImageBox.displayName = "ImageBox";

export default ImageBox;
