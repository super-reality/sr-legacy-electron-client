import Axios from "axios";
import fs from "fs";
import handleGetTTS from "../renderer/api/handleGetTTS";
// import setLoading from "../renderer/redux/utils/setLoading";
import downloadFile from "./downloadFIle";
import md5 from "./md5";
import playSound from "./playSound";

export default function getTTS(text: string, play?: boolean): Promise<void> {
  // eslint-disable-next-line global-require
  const { app, remote } = require("electron");
  const userData = (app || remote.app).getPath("userData").replace(/\\/g, "/");
  const filename = `${userData}/${md5(text)}.wav`;

  if (fs.existsSync(filename)) {
    if (play) {
      return playSound(filename);
    }
    return new Promise((r) => r());
  }

  const payload = {
    lesson: text,
  };

  return Axios.post<string>(
    `http://54.177.153.12:8080/text_to_speech/`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then(handleGetTTS)
    .then((result) => {
      const { url } = JSON.parse(JSON.stringify(result));
      console.log(filename, url);
      return downloadFile(url, filename)
        .then(() => playSound(filename))
        .catch(console.error);
    })
    .catch((err) => {
      console.log(err);
    });
}
