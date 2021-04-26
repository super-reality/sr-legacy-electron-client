/* eslint-disable react/prop-types */
import { forwardRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Howler } from "howler";
import { ItemDialog } from "../../item";
import ButtonRound from "../../../components/button-round";
import { ReactComponent as MuteIcon } from "../../../../assets/svg/mute.svg";
import { ReactComponent as UnmuteIcon } from "../../../../assets/svg/unmute.svg";
import { ReactComponent as TTSIcon } from "../../../../assets/svg/add-tts.svg";
import Flex from "../../../components/flex";
import "./index.scss";
import getTTS from "../../../../utils/api/getTTS";
import reduxAction from "../../../redux/reduxAction";
import { AppState } from "../../../redux/stores/renderer";
import { BaseBoxProps } from "../boxes";

const DialogBox = forwardRef<HTMLDivElement, BaseBoxProps<ItemDialog>>(
  (props, forwardedRef) => {
    const { item, style, pos } = props;

    const dispatch = useDispatch();
    const muted = useSelector((state: AppState) => state.lessonPlayer.ttsOn);

    const toggleMute = useCallback(() => {
      reduxAction(dispatch, { type: "SET_TTS", arg: !muted });
    }, [dispatch, muted]);

    useEffect(() => {
      if (!muted) {
        getTTS(item.text, true);
      } else {
        Howler.unload();
      }
    }, [item, muted]);

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
        <div className="dialog-text">{item.text}</div>
        <Flex style={{ justifyContent: "center" }}>
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
            onClick={() => getTTS(item.text, true)}
            svg={TTSIcon}
          />
        </Flex>
      </div>
    );
  }
);

DialogBox.displayName = "DialogBox";

export default DialogBox;
