import { BaseItemType, Item } from "../../../api/types/item/item";

export default function getDefaultItemProps(type: BaseItemType): Partial<Item> {
  const payload: Partial<Item> = { type };
  if (payload.type == "focus_highlight" && !payload.focus) {
    payload.relativePos = { x: 0, y: 0, width: 100, height: 100 };
    payload.focus = "Area highlight";
    payload.trigger = 1;
  }
  if (payload.type == "image" && !payload.relativePos) {
    payload.relativePos = { x: 0, y: 0, width: 400, height: 300 };
    payload.trigger = 1;
  }
  if (payload.type == "audio" && !payload.relativePos) {
    payload.relativePos = { x: 0, y: 0, width: 400, height: 200 };
    payload.trigger = 1;
  }
  if (payload.type == "video" && !payload.relativePos) {
    payload.relativePos = { x: 0, y: 0, width: 400, height: 200 };
    payload.trigger = 1;
  }
  if (payload.type == "dialog") {
    payload.relativePos = { x: 0, y: 0, width: 400, height: 200 };
    payload.trigger = 1;
  }
  if (payload.type == "fx" && !payload.effect) {
    payload.relativePos = { x: 0, y: 0, width: 400, height: 400 };
    payload.effect = "id_1";
    payload.trigger = 1;
    payload.fullScreen = false;
  }

  return payload;
}
