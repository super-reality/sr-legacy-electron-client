import { CodeSuccess } from "..";
import { ICollection } from "./collection";

/* eslint-disable camelcase */
export default interface CollectionCreate {
  err_code: CodeSuccess;
  data: ICollection;
}
