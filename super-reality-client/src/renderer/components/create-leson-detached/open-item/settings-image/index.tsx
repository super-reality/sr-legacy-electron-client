import React from "react";
import { ItemImage } from "../../../../api/types/item/item";
import BaseInput from "../../../base-input";
import "../../../lesson-player/find-box/index.scss";

interface SettingsImage {
  item: ItemImage;
  update: (date: Partial<ItemImage>) => void;
}

export default function SettingsImage(props: SettingsImage) {
  const { item, update } = props;

  return (
    <BaseInput
      title="Image URL"
      value={item.url}
      onChange={(e) => update({ url: e.currentTarget.value })}
    />
  );
}
