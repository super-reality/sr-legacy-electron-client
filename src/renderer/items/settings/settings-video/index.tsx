import { useCallback } from "react";
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
      {(!item.source || item.source == "raw") && (
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
      )}
      {item.source == "youtube" && (
        <iframe
          src={`https://www.youtube.com/embed/${item.url}`}
          style={{
            pointerEvents: "none",
            maxHeight: "100%",
          }}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
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
