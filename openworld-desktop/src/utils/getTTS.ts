import Axios from "axios";
import fs from "fs";
import fileDownload from "js-file-download";
import handleGetTTS from "../renderer/api/handleGetTTS";
import setLoading from "../renderer/redux/utils/setLoading";
import sha1 from "./sha1";
import playSound from "./playSound";

export default function getTTS(text: string, play?: boolean): void {
  setLoading(true);

  const filename = `${sha1(text)}.wav`;

  if (fs.existsSync(filename)) {
    if (play) {
      playSound(filename);
    }
    return;
  }

  const payload = {
    lesson: text,
  };

  Axios.post<string>(`http://54.215.241.77:5000/text_to_speech`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(handleGetTTS)
    .then((url) => {
      fileDownload(url, filename);
    })
    .catch((err) => {
      setLoading(false);
    });
}
