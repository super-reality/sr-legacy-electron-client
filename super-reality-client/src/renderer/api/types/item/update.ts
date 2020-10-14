import { CodeSuccess, ApiSucess } from "..";
import { Item } from "./item";

/* eslint-disable camelcase */
export default interface ItemUpdate extends ApiSucess {
  err_code: CodeSuccess;
  item: Item;
}
