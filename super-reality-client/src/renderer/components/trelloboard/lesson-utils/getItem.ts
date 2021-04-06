import Axios from "axios";
import handleGenericGet from "../../../api/handleGenericRequest";
import { ApiError } from "../../../api/types";
import { ItemGet } from "../../../api/types/item/get";
import { Item } from "../../../items/item";
import { API_URL } from "../../../constants";

export default function getItem(id: string): Promise<Item> {
  return new Promise((resolve, reject) => {
    Axios.get<ItemGet | ApiError>(`${API_URL}item/${id}`)
      .then((res) => handleGenericGet<ItemGet>(res))
      .then((data) => resolve(data.item))
      .catch(reject);
  });
}
