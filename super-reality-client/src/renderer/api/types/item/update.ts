import { CodeSuccess, ApiSucess } from "..";
import { BaseItem } from "../../../items/item";

/* eslint-disable camelcase */
export default interface ItemUpdate<T extends BaseItem> extends ApiSucess {
  err_code: CodeSuccess;
  item: T;
}
