import { AxiosResponse } from "axios";

export default function handleGetTTS(
  res: AxiosResponse<string>
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (res.status === 200) {
      resolve(res.data);
    } else {
      reject();
    }
  });
}
