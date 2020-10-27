/* eslint-disable camelcase */
import { CodeSuccess, ApiSucess } from "..";
import { Item } from "./item";

export interface ItemGet extends ApiSucess {
  err_code: CodeSuccess;
  item: Item;
}
