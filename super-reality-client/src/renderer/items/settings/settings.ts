import { BaseItem } from "../item";

export interface BaseSettingsProps<T extends BaseItem> {
  item: T;
  update: (date: Partial<T>) => void;
}
