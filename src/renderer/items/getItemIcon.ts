import { Item } from "./item";
import itemsDatabase from "./itemsDatabase";

export default function getItemIcon(itemData: Item) {
  if (itemData) return itemsDatabase[itemData.type].icon;
  return undefined;
}
