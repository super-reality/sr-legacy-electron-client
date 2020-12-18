import { BaseItemType, Item } from "../../../items/item";

export default function getDefaultItemProps(type: BaseItemType): Partial<Item> {
  const payload: Partial<Item> = { type };
  if (payload.type == "focus_highlight" && !payload.focus) {
    if (!payload.relativePos)
      payload.relativePos = { x: 0, y: 0, width: 100, height: 100 };
    if (!payload.focus) payload.focus = "Area highlight";
  }
  if (payload.type == "image") {
    if (!payload.relativePos)
      payload.relativePos = { x: 0, y: 0, width: 400, height: 300 };
  }
  if (payload.type == "audio") {
    if (!payload.relativePos)
      payload.relativePos = { x: 0, y: 0, width: 400, height: 200 };
  }
  if (payload.type == "video") {
    if (!payload.relativePos)
      payload.relativePos = { x: 0, y: 0, width: 400, height: 200 };
  }
  if (payload.type == "dialog") {
    if (!payload.relativePos)
      payload.relativePos = { x: 0, y: 0, width: 400, height: 200 };
  }
  if (payload.type == "fx" && !payload.effect) {
    payload.relativePos = { x: 0, y: 0, width: 400, height: 400 };
    payload.effect = "id_1";
    payload.trigger = 1;
    payload.fullScreen = false;
  }

  return payload;
}
