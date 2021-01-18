import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { ItemVideo } from "../../item";
import BaseInput from "../../../components/base-input";
import "../../boxes/find-box/index.scss";
import { BaseSettingsProps } from "../settings";
import reduxAction from "../../../redux/reduxAction";
import BaseToggle from "../../../components/base-toggle";

export default function SettingsVideo(props: BaseSettingsProps<ItemVideo>) {
  const { item, update } = props;
  const dispatch = useDispatch();

  const openPanel = useCallback(
    (panel: string) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { openPanel: panel },
      });
    },
    [dispatch]
  );

  return (
    <>
      <video
        style={{
          background: "var(--color-background-dark)",
          maxWidth: "100%",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={() => openPanel("item-video")}
        src={item.url}
      />
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
    </>
  );
}
