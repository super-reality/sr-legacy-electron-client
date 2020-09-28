import { CodeSuccess } from "..";
import { Parents } from "../lesson/search-parent";

/* eslint-disable camelcase */
export default interface SubjectSearchParent {
  err_code: CodeSuccess;
  parents: Parents[];
}
