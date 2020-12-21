import { CodeSuccess, ApiSucess } from "..";
import { Item } from "../../../items/item";

/* eslint-disable camelcase */
export default interface ItemUpdate extends ApiSucess {
  err_code: CodeSuccess;
  item: Item;
}
