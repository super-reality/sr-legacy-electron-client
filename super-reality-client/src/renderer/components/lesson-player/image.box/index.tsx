/* eslint-disable react/prop-types */
import React, { CSSProperties } from "react";
import "./index.scss";

interface ImageBoxProps {
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: CSSProperties;
  image: string;
}

const ImageBox = React.forwardRef<HTMLDivElement, ImageBoxProps>(
  (props, forwardedRef) => {
    const { image, style, pos } = props;

    return (
      <div
        ref={forwardedRef}
        className="image-box"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${pos.width - 6}px`,
          height: `${pos.height - 6}px`,
          ...style,
        }}
      >
        <img src={image} />
      </div>
    );
  }
);

ImageBox.displayName = "ImageBox";

export default ImageBox;
