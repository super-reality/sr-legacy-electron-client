import React from "react";
import { ItemVideo } from "../../item";
import BaseInput from "../../../components/base-input";
import "../../boxes/find-box/index.scss";
import { BaseSettingsProps } from "../settings";

export default function SettingsVideo(props: BaseSettingsProps<ItemVideo>) {
  const { item, update } = props;

  return (
    <BaseInput
      title="Video URL"
      value={item.url}
      onChange={(e) => update({ url: e.currentTarget.value })}
    />
  );
}
