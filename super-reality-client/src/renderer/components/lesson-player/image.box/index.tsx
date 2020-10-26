/* eslint-disable react/prop-types */
import React, { CSSProperties } from "react";
import { voidFunction } from "../../../constants";
import ButtonSimple from "../../button-simple";
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
  callback?: () => void;
}

const ImageBox = React.forwardRef<HTMLDivElement, ImageBoxProps>(
  (props, forwardedRef) => {
    const { image, style, pos, callback } = props;

    return (
      <div
        ref={forwardedRef}
        className="image-box"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
          ...style,
        }}
      >
        <img src={image} />
        <ButtonSimple
          width="200px"
          height="24px"
          margin="auto"
          onClick={callback || voidFunction}
        >
          Ok
        </ButtonSimple>
      </div>
    );
  }
);

ImageBox.displayName = "ImageBox";

export default ImageBox;
