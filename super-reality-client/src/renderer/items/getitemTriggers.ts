import {
  Item,
  ItemAudioTriggers,
  ItemDialogTriggers,
  ItemFocusTriggers,
  ItemFXTriggers,
  ItemImageTriggers,
  ItemVideoTriggers,
} from "./item";

export default function getItemTriggers(
  item: Item
): Record<string, number | null> {
  let triggers: Record<string, number | null> = { None: null };
  if (item) {
    switch (item.type) {
      case "focus_highlight":
        triggers = ItemFocusTriggers;
        break;
      case "fx":
        triggers = ItemFXTriggers;
        break;
      case "audio":
        triggers = ItemAudioTriggers;
        break;
      case "image":
        triggers = ItemImageTriggers;
        break;
      case "video":
        triggers = ItemVideoTriggers;
        break;
      case "dialog":
        triggers = ItemDialogTriggers;
        break;
      default:
        break;
    }
  }

  return triggers;
}
