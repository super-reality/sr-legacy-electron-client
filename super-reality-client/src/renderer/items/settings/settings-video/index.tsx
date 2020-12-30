import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ItemVideo } from "../../item";
import BaseInput from "../../../components/base-input";
import "../../boxes/find-box/index.scss";
import { BaseSettingsProps } from "../settings";
import ButtonSimple from "../../../components/button-simple";
import reduxAction from "../../../redux/reduxAction";
import BaseToggle from "../../../components/base-toggle";

export default function SettingsVideo(props: BaseSettingsProps<ItemVideo>) {
  const { item, update } = props;
  const dispatch = useDispatch();

  const doTrimVideo = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        previewMode: "TRIM_VIDEO",
      },
    });
  }, [dispatch]);

  return (
    <>
      <BaseInput
        title="Video URL"
        value={item.url}
        onChange={(e) => update({ url: e.currentTarget.value })}
      />
      <BaseToggle
        title="muted"
        value={item.muted == undefined ? true : item.muted}
        callback={(val) => update({ muted: val })}
      />
      <ButtonSimple width="120px" height="24px" onClick={doTrimVideo}>
        Trim new
      </ButtonSimple>
    </>
  );
}
