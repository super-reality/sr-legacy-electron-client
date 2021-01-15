/* eslint-disable react/prop-types */
import React, { useCallback, useRef, useState } from "react";
import { ItemImageTriggers, ItemVideo } from "../../item";
import { voidFunction } from "../../../constants";
import ButtonSimple from "../../../components/button-simple";
import "./index.scss";
import { BaseBoxProps } from "../boxes";

const VideoBox = React.forwardRef<HTMLDivElement, BaseBoxProps<ItemVideo>>(
  (props, forwardedRef) => {
    const { item, style, pos, callback } = props;
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [play, setPlay] = useState(true);

    const doClick = useCallback(() => {
      setPlay(!play);
      if (videoRef.current) {
        if (play) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      }
    }, [play, videoRef]);

    return (
      <div
        ref={forwardedRef}
        className="video-box click-on"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
          ...style,
        }}
      >
        <video
          ref={videoRef}
          onClick={doClick}
          muted={item.muted == undefined ? true : item.muted}
          autoPlay
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

VideoBox.displayName = "VideoBox";

export default VideoBox;
