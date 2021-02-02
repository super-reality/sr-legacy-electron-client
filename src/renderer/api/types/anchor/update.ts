import { CodeSuccess, ApiSucess } from "..";
import { IAnchor } from "./anchor";

/* eslint-disable camelcase */
export default interface AnchorUpdate extends ApiSucess {
  err_code: CodeSuccess;
  anchor: IAnchor;
}
