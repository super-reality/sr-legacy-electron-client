import Axios from "axios";
import handleGPT3CreateQuestion from "../../renderer/api/handleGPT3CreateQuestion";
import { ApiError } from "../../renderer/api/types";
import {
  IPostQuestion,
  IGetQuestion,
} from "../../renderer/api/types/gpt-3/GPT3";
import { GPT3_API_URL, GPT3_JWT } from "../../renderer/constants";

export default function createGPT3Question(
  question: IPostQuestion
): Promise<IGetQuestion> {
  return new Promise((resolve, reject) => {
    Axios.post<IGetQuestion | ApiError>(`${GPT3_API_URL}ask/`, question, {
      headers: {
        Authorization: `Token ${GPT3_JWT}`,
      },
    })
      .then(handleGPT3CreateQuestion)
      .then(resolve)
      .catch(reject);
  });
}
