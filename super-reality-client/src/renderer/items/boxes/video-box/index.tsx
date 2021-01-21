/* eslint-disable react/prop-types */
import React, { useCallback, useRef, useState } from "react";
import { ItemVideo } from "../../item";
import "./index.scss";
import { BaseBoxProps } from "../boxes";

const VideoBox = React.forwardRef<HTMLDivElement, BaseBoxProps<ItemVideo>>(
  (props, forwardedRef) => {
    const { item, style, pos } = props;
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
            maxHeight: "100%",
          }}
          src={item.url}
        />
      </div>
    );
  }
);

VideoBox.displayName = "VideoBox";

export default VideoBox;
