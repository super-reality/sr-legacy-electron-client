import Axios from "axios";
import handleItemCreate from "../../../api/handleItemCreate";
import { ApiError } from "../../../api/types";
import ItemCreate from "../../../api/types/item/create";
import { BaseItemType, Item } from "../../../api/types/item/item";
import { API_URL } from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";
import updateStep from "./updateStep";

export default function newItem(
  type: BaseItemType | Partial<Item>,
  step?: string
): Promise<void> {
  const payload: Partial<Item> =
    typeof type == "string"
      ? {
          type,
        }
      : { ...type };
  if (payload.type == "focus_highlight" && !payload.focus) {
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
    payload.trigger = 1;
  }
  return Axios.post<ItemCreate | ApiError>(`${API_URL}item/create`, payload)
    .then(handleItemCreate)
    .then((data) => {
      reduxAction(store.dispatch, {
        type: "CREATE_LESSON_V2_SETITEM",
        arg: { item: data, step },
      });
      if (step) {
        updateStep({}, step);
      }
    })
    .catch(console.error);
}
