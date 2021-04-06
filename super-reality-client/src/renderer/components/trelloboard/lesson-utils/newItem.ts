import Axios from "axios";
import handleItemCreate from "../../../api/handleItemCreate";
import { ApiError } from "../../../api/types";
import ItemCreate from "../../../api/types/item/create";
import { BaseItemType, Item } from "../../../items/item";
import { API_URL } from "../../../constants";
import reduxAction from "../../../redux/reduxAction";
import store from "../../../redux/stores/renderer";
import getDefaultItemProps from "../../../items/getDefaultItemProps";
import updateStep from "./updateStep";

export default function newItem(
  type: BaseItemType | Partial<Item>,
  step?: string
): Promise<Item | void> {
  const payload: Partial<Item> =
    typeof type == "string" ? getDefaultItemProps(type) : { ...type };

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
      return data;
    })
    .catch(console.error);
}
