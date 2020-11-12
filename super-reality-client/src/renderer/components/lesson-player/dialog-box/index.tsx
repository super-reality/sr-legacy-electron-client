/* eslint-disable react/prop-types */
import React, { CSSProperties } from "react";
import { ItemImageTriggers } from "../../../api/types/item/item";
import { voidFunction } from "../../../constants";
import ButtonSimple from "../../button-simple";
import "./index.scss";

interface DialogBoxProps {
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: CSSProperties;
  text: string;
  callback?: (trigger: number) => void;
}

const DialogBox = React.forwardRef<HTMLDivElement, DialogBoxProps>(
  (props, forwardedRef) => {
    const { text, style, pos, callback } = props;

    return (
      <div
        ref={forwardedRef}
        className="dialog-box"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
          ...style,
        }}
      >
        <div>{text}</div>
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
      </div>
    );
  }
);

DialogBox.displayName = "DialogBox";

export default DialogBox;
