import { CodeSuccess, ApiSucess } from ".";

/* eslint-disable camelcase */
export default interface GenericDelete extends ApiSucess {
  err_code: CodeSuccess;
  message: string;
}
