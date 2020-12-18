import { BaseItem, Item } from "./item";
import { BaseSettingsProps } from "./settings/settings";
import SettingsDialog from "./settings/settings-dialog";
import SettingsFocusHighlight from "./settings/settings-focus-highlight";
import FXSettings from "./settings/settings-fx";
import SettingsImage from "./settings/settings-image";

type Ret<T extends BaseItem> =
  | ((props: BaseSettingsProps<T>) => JSX.Element)
  | undefined;

export default function getItemSettings<T extends BaseItem>(
  item: Item
): Ret<T> {
  let SettingsComponent: Ret<T>;

  switch (item.type) {
    case "focus_highlight":
      SettingsComponent = SettingsFocusHighlight as any;
      break;
    case "image":
      SettingsComponent = SettingsImage as any;
      break;
    case "dialog":
      SettingsComponent = SettingsDialog as any;
      break;
    case "fx":
      SettingsComponent = FXSettings as any;
      break;
    default:
      break;
  }

  return SettingsComponent;
}
