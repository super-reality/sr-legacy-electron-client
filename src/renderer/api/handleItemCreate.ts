import { AxiosResponse } from "axios";
import { ApiError } from "./types";
import { Item } from "../items/item";
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
