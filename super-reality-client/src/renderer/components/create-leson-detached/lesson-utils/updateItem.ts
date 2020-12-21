import Axios from "axios";
import _ from "lodash";
import handleItemUpdate from "../../../api/handleItemUpdate";
import { ApiError } from "../../../api/types";
import ItemUpdate from "../../../api/types/item/update";
import { API_URL } from "../../../constants";
import { BaseItem } from "../../../items/item";

export default function updateItem<T extends BaseItem>(
  data: Partial<T>,
  id: string
) {
  const newData = {
    ...data,
    item_id: id,
  };

  return Axios.put<ItemUpdate<T> | ApiError>(
    `${API_URL}item`,
    _.omit(newData, ["_id", "__v", "createdBy", "createdAt", "updatedAt"])
  )
    .then((d) => handleItemUpdate<T>(d))
    .catch((e) => {
      console.error(e);
      return undefined;
    });
}
