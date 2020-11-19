/* eslint-disable react/prop-types */
import React, { CSSProperties } from "react";
import { ItemImageTriggers } from "../../../api/types/item/item";
import { voidFunction } from "../../../constants";
import ButtonRound from "../../button-round";
import ButtonSimple from "../../button-simple";
import { ReactComponent as AudioIcon } from "../../../../assets/svg/mute.svg";
import Flex from "../../flex";
import "./index.scss";
import getTTS from "../../../../utils/getTTS";

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
        <div className="dialog-text">{text}</div>
        <Flex style={{ justifyContent: "center" }}>
          <ButtonSimple
            width="200px"
            height="24px"
            margin="0 16px 0 0"
            onClick={
              callback
                ? () => callback(ItemImageTriggers["Click Ok button"])
                : voidFunction
            }
          >
            Ok
          </ButtonSimple>
          <ButtonRound
            width="40px"
            height="40px"
            onClick={() => getTTS(text, true)}
            svg={AudioIcon}
          />
        </Flex>
      </div>
    );
  }
);

DialogBox.displayName = "DialogBox";

export default DialogBox;
