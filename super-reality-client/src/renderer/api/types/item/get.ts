/* eslint-disable camelcase */
import { CodeSuccess, ApiSucess } from "..";
import { Item } from "../../../items/item";

export interface ItemGet extends ApiSucess {
  err_code: CodeSuccess;
  item: Item;
}
