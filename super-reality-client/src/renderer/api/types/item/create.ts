import { CodeSuccess } from "..";
import { Item } from "./item";

/* eslint-disable camelcase */
export default interface ItemCreate {
  err_code: CodeSuccess;
  item: Item;
}
