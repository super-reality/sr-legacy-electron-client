/* eslint-disable react/prop-types */
import React from "react";
import { useSelector } from "react-redux";
import { ItemVideo } from "../../item";
import "./index.scss";
import { BaseBoxProps } from "../boxes";
import { AppState } from "../../../redux/stores/renderer";
import useItemBehaviour from "../../useItemBehaviour";

const YoutubeBox = React.forwardRef<HTMLDivElement, BaseBoxProps<ItemVideo>>(
  (props, forwardedRef) => {
    const { item, style, pos, callback } = props;
    const { previewing } = useSelector(
      (state: AppState) => state.createLessonV2
    );

    const [combinedRef, , , InfoBox] = useItemBehaviour(
      callback,
      forwardedRef,
      true,
      item
    );

    return (
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
    );
  }
);

YoutubeBox.displayName = "YoutubeBox";

export default YoutubeBox;
