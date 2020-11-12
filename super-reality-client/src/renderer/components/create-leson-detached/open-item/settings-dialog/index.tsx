import React from "react";
import { ItemDialog } from "../../../../api/types/item/item";
import BaseInput from "../../../base-input";
import "../../../lesson-player/find-box/index.scss";

interface SettingsDialog {
  item: ItemDialog;
  update: (date: Partial<ItemDialog>) => void;
}

export default function SettingsDialog(props: SettingsDialog) {
  const { item, update } = props;

  return (
    <BaseInput
      title="Text"
      value={item.text}
      onChange={(e) => update({ text: e.currentTarget.value })}
    />
  );
}
