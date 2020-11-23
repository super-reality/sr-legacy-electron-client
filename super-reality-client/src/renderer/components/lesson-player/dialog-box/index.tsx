/* eslint-disable react/prop-types */
import React, { CSSProperties, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Howler } from "howler";
import { ItemImageTriggers } from "../../../api/types/item/item";
import { voidFunction } from "../../../constants";
import ButtonRound from "../../button-round";
import ButtonSimple from "../../button-simple";
import { ReactComponent as MuteIcon } from "../../../../assets/svg/mute.svg";
import { ReactComponent as UnmuteIcon } from "../../../../assets/svg/unmute.svg";
import { ReactComponent as TTSIcon } from "../../../../assets/svg/add-tts.svg";
import Flex from "../../flex";
import "./index.scss";
import getTTS from "../../../../utils/getTTS";
import reduxAction from "../../../redux/reduxAction";
import { AppState } from "../../../redux/stores/renderer";

interface DialogBoxProps {
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: CSSProperties;
  text: string;
  trigger: null | number;
  callback?: (trigger: number) => void;
}

const DialogBox = React.forwardRef<HTMLDivElement, DialogBoxProps>(
  (props, forwardedRef) => {
    const { text, trigger, style, pos, callback } = props;

    const dispatch = useDispatch();
    const muted = useSelector((state: AppState) => state.lessonPlayer.ttsOn);

    const toggleMute = useCallback(() => {
      reduxAction(dispatch, { type: "SET_TTS", arg: !muted });
    }, [dispatch, muted]);

    useEffect(() => {
      if (!muted) {
        getTTS(text, true);
      } else {
        Howler.unload();
      }
    }, [text, muted]);

    return (
      <div
        ref={forwardedRef}
        className="dialog-box click-on"
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
          {trigger && (
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
          )}
          <ButtonRound
            width="40px"
            height="40px"
            onClick={toggleMute}
            svg={muted ? UnmuteIcon : MuteIcon}
          />
          <ButtonRound
            style={{ marginLeft: "16px" }}
            width="40px"
            height="40px"
            onClick={() => getTTS(text, true)}
            svg={TTSIcon}
          />
        </Flex>
      </div>
    );
  }
);

DialogBox.displayName = "DialogBox";

export default DialogBox;
