import Axios from "axios";
import handleItemUpdate from "../../../api/handleItemUpdate";
import { ApiError } from "../../../api/types";
import { Item } from "../../../api/types/item/item";
import ItemUpdate from "../../../api/types/item/update";
import { API_URL } from "../../../constants";

export default function updateItem(data: Partial<Item>, id: string) {
  const newData = {
    ...data,
    item_id: id,
  };

  Axios.put<ItemUpdate | ApiError>(`${API_URL}item`, newData)
    .then(handleItemUpdate)
    .catch(console.error);
}
