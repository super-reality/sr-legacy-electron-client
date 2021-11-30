import { AxiosResponse } from "axios";
import apiErrorHandler from "./apiErrorHandler";
import { ApiError } from "./types";
import { IPostDocument, IPostDocumentPayload } from "./types/gpt-3/GPT3";

/* eslint-disable camelcase */
export default function handleGPT3CreateDocument(
  res: AxiosResponse<IPostDocumentPayload | ApiError>
): Promise<IPostDocument> {
  return new Promise((resolve, reject) => {
    apiErrorHandler<IPostDocumentPayload>(res)
      .then((d) => resolve(d.response))
      .catch(reject);
  });
}
