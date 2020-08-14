import IUser from "../schemas/IUser";
import { CodeSuccess } from "..";

/* eslint-disable camelcase */
export default interface SignUp {
  err_code: CodeSuccess;
  user: IUser;
  token: string;
}
