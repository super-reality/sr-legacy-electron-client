import React from "react";
import BaseInput from "../../../components/base-input";
import "../../boxes/find-box/index.scss";
import { ItemYoutube } from "../../item";
import { BaseSettingsProps } from "../settings";

export default function SettingsYoutube(props: BaseSettingsProps<ItemYoutube>) {
  const { item, update } = props;

  return (
    <BaseInput
      title="Youtube URL"
      value={item.url}
      onChange={(e) => update({ url: e.currentTarget.value })}
    />
  );
}
