import { CodeSuccess } from "..";
import { IAnchor } from "./anchor";

/* eslint-disable camelcase */
export default interface AnchorCreate {
  err_code: CodeSuccess;
  anchor: IAnchor;
}
