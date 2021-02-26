import Axios from "axios";
import handleGPT3CreateDocument from "../../renderer/api/handleGPT3CreateDocument";
import { ApiError } from "../../renderer/api/types";
import {
  IPostDocument,
  IPostDocumentPayload,
} from "../../renderer/api/types/gpt-3/GPT3";
import { GPT3_API_URL, GPT3_JWT } from "../../renderer/constants";

export default function createGPT3Document(
  document: IPostDocument
): Promise<IPostDocument> {
  return new Promise((resolve, reject) => {
    Axios.post<IPostDocumentPayload | ApiError>(
      `${GPT3_API_URL}document/`,
      document,
      {
        headers: {
          Authorization: `Token ${GPT3_JWT}`,
        },
      }
    )
      .then(handleGPT3CreateDocument)
      .then(resolve)
      .catch(reject);
  });
}
