/* eslint-disable react/prop-types */
import { forwardRef, useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ItemVideo } from "../../item";
import "./index.scss";
import { BaseBoxProps } from "../boxes";
import { AppState } from "../../../redux/stores/renderer";
import useItemBehaviour from "../../useItemBehaviour";

const VideoBox = forwardRef<HTMLDivElement, BaseBoxProps<ItemVideo>>(
  (props, forwardedRef) => {
    const { item, style, pos, callback } = props;
    const { previewing } = useSelector(
      (state: AppState) => state.createLessonV2
    );
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [play, setPlay] = useState(true);

    const [combinedRef, , , InfoBox] = useItemBehaviour(
      callback,
      forwardedRef,
      true,
      item
    );

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
      <>
        {(!item.source || item.source == "raw") && (
          <div
            ref={combinedRef}
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
              muted={item.muted}
              autoPlay
              style={{
                maxHeight: "100%",
              }}
              src={item.url}
            />
            {InfoBox}
          </div>
        )}
        {item.source == "youtube" && (
          <div
            ref={combinedRef}
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
              src={`https://www.youtube.com/embed/${item.url}`}
              style={{
                pointerEvents: previewing ? "all" : "none",
                maxHeight: "100%",
              }}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {InfoBox}
          </div>
        )}
      </>
    );
  }
);

VideoBox.displayName = "VideoBox";

export default VideoBox;
