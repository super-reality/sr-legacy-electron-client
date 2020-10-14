import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { Item } from "./types/item/item";
import itemUpdate from "./types/item/update";

/* eslint-disable camelcase */
export default function handleItemUpdate(
  res: AxiosResponse<itemUpdate | ApiError>
): Promise<Item> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<itemUpdate>(res)
      .then((d) => resolve(d.item))
      .catch(reject);
  });
}
