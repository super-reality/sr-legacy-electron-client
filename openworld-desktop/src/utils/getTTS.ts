import Axios from "axios";
import fs from "fs";
import https from "http";
import handleGetTTS from "../renderer/api/handleGetTTS";
import setLoading from "../renderer/redux/utils/setLoading";
import sha1 from "./sha1";
import playSound from "./playSound";

export default function getTTS(text: string, play?: boolean): void {
  // eslint-disable-next-line global-require
  const { app, remote } = require("electron");
  const userData = (app || remote.app).getPath("userData").replace(/\\/g, "/");
  const filename = `${userData}/${sha1(text)}.wav`;

  if (fs.existsSync(filename)) {
    if (play) {
      playSound(filename);
    }
    return;
  }
  setLoading(true);
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
      const file = fs.createWriteStream(filename);
      setLoading(false);
      console.log(url);
      const request = https.get(url, (response) => {
        response.pipe(file);
        file.on("finish", () => {
          playSound(filename);
        });
      });
    })
    .catch((err) => {
      setLoading(false);
    });
}
