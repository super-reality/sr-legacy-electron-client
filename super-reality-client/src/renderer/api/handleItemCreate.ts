import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { Item } from "./types/item/item";
import ItemCreate from "./types/item/create";
import apiErrorHandler from "./apiErrorHandler";

export default function handleItemCreate(
  res: AxiosResponse<ItemCreate | ApiError>
): Promise<Item> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<ItemCreate>(res)
      .then((d) => resolve(d.item))
      .catch(reject);
  });
}
