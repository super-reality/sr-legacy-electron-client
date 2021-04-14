import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IGetQuestion } from "./types/gpt-3/GPT3";

/* eslint-disable camelcase */
export default function handleGPT3CreateQuestion(
  res: AxiosResponse<IGetQuestion | ApiError>
): Promise<IGetQuestion> {
  res.data.err_code = 0;
  return new Promise((resolve, reject) => {
    apiErrorHandler<IGetQuestion>(res).then(resolve).catch(reject);
  });
}
