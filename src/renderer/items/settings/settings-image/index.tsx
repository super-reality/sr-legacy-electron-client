import { ItemImage } from "../../item";
import BaseInput from "../../../components/base-input";
import "../../boxes/find-box/index.scss";
import { BaseSettingsProps } from "../settings";

export default function SettingsImage(props: BaseSettingsProps<ItemImage>) {
  const { item, update } = props;

  return (
    <BaseInput
      title="Image URL"
      value={item.url}
      onChange={(e) => update({ url: e.currentTarget.value })}
    />
  );
}
