import { BaseItemType, Item } from "../../../api/types/item/item";

export default function getDefaultItemProps(type: BaseItemType): Partial<Item> {
  const payload: Partial<Item> = { type };
  if (payload.type == "focus_highlight" && !payload.focus) {
    if (!payload.relativePos)
      payload.relativePos = { x: 0, y: 0, width: 100, height: 100 };
    if (!payload.focus) payload.focus = "Area highlight";
    payload.trigger = 1;
  }
  if (payload.type == "image") {
    if (!payload.relativePos)
      payload.relativePos = { x: 0, y: 0, width: 400, height: 300 };
    payload.trigger = 1;
  }
  if (payload.type == "audio") {
    if (!payload.relativePos)
      payload.relativePos = { x: 0, y: 0, width: 400, height: 200 };
    payload.trigger = 1;
  }
  if (payload.type == "video") {
    if (!payload.relativePos)
      payload.relativePos = { x: 0, y: 0, width: 400, height: 200 };
    payload.trigger = 1;
  }
  if (payload.type == "dialog") {
    if (!payload.relativePos)
      payload.relativePos = { x: 0, y: 0, width: 400, height: 200 };
  }

  return payload;
}
