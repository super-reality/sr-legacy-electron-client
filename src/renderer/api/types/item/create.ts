import { CodeSuccess } from "..";
import { Item } from "../../../items/item";

/* eslint-disable camelcase */
export default interface ItemCreate {
  err_code: CodeSuccess;
  item: Item;
}
