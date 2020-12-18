/* eslint-disable react/prop-types */
import React from "react";
import { ItemImageTriggers, ItemVideo } from "../../item";
import { voidFunction } from "../../../constants";
import ButtonSimple from "../../../components/button-simple";
import "./index.scss";
import { BaseBoxProps } from "../boxes";

const YoutubeBox = React.forwardRef<HTMLDivElement, BaseBoxProps<ItemVideo>>(
  (props, forwardedRef) => {
    const { item, style, pos, callback } = props;

    return (
      <div
        ref={forwardedRef}
        className="youtube-box click-on"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
          ...style,
        }}
      >
        <iframe
          src={item.url}
          style={{
            maxHeight: item.trigger ? "calc(100% - 64px)" : "100%",
          }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
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

YoutubeBox.displayName = "YoutubeBox";

export default YoutubeBox;
