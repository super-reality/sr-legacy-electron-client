import { BaseItem, Item } from "./item";
import itemsDatabase from "./itemsDatabase";
import { BaseSettingsProps } from "./settings/settings";

type Ret<T extends BaseItem> =
  | ((props: BaseSettingsProps<T>) => JSX.Element)
  | undefined;

export default function getItemSettings<T extends BaseItem>(
  item: Item
): Ret<T> {
  let SettingsComponent: Ret<T>;

  if (item && itemsDatabase[item.type]) {
    SettingsComponent = itemsDatabase[item.type].settings as any;
  }

  return SettingsComponent;
}
