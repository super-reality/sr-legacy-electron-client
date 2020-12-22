import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { BaseItem } from "../items/item";
import itemUpdate from "./types/item/update";

/* eslint-disable camelcase */
export default function handleItemUpdate<T extends BaseItem>(
  res: AxiosResponse<itemUpdate<T> | ApiError>
): Promise<T> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<itemUpdate<T>>(res)
      .then((d) => resolve(d.item))
      .catch(reject);
  });
}
