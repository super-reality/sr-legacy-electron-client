/* eslint-disable global-require */
/* eslint-disable react/prop-types */
import { CSSProperties, forwardRef, RefObject } from "react";
import { ReactComponent as PlayIcon } from "../../../../assets/svg/play.svg";
import "./index.scss";

interface VideoCropBoxProps {
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: CSSProperties;
  clickThrough?: boolean;
  ref?: RefObject<HTMLDivElement>;
}

const VideoCropBox = forwardRef<HTMLDivElement, VideoCropBoxProps>(
  (props, forwardedRef) => {
    const { pos, style, clickThrough } = props;

    return (
      <>
        <div
          ref={forwardedRef}
          className={`find-box ${
            clickThrough ? "click-through" : ""
          } video-trim`}
          style={{
            left: `${pos.x - 3}px`,
            top: `${pos.y - 3}px`,
            width: `${pos.width}px`,
            height: `${pos.height}px`,
            ...style,
          }}
        >
          {pos.width > 150 && pos.height > 150 && (
            <PlayIcon
              fill="var(--color-green)"
              style={{ opacity: 0.66, margin: "auto" }}
            />
          )}
        </div>
      </>
    );
  }
);

VideoCropBox.displayName = "VideoCropBox";

export default VideoCropBox;
