/* eslint-disable camelcase */
import { CodeSuccess, ApiSucess } from "..";
import { IAnchor } from "./anchor";

export interface AnchorGet extends ApiSucess {
  err_code: CodeSuccess;
  anchor: IAnchor;
}
