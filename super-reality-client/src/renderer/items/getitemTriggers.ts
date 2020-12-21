import { Item } from "./item";
import itemsDatabase from "./itemsDatabase";

export default function getItemTriggers(
  item: Item
): Record<string, number | null> {
  let triggers: Record<string, number | null> = { None: null };
  if (item && itemsDatabase[item.type]) {
    triggers = itemsDatabase[item.type].triggers;
  }

  return triggers;
}
