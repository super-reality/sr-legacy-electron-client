import fs from "fs";
import path from "path";
import http from "http";

import setLoading from "../renderer/redux/utils/setLoading";
import userDataPath from "./userDataPath";
import getRandomFileSha1 from "./getRandomFileSha1";

// export default function getFace(image: string, video: string): void {
export default function getSTT(inAudio: HTMLInputElement): void {
  if (inAudio && inAudio.files) {
    console.log("inAudio", inAudio.files[0]);
  }
  setLoading(true);
  const options = {
    method: "POST",
    hostname: "54.219.193.178",
    port: 5000,
    path: "/speech_to_text",
    headers: {
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Cache-Control": "no-store",
    },
    maxRedirects: 20,
  };

  const req = http.request(options, (res) => {
    const chunks: any[] = [];
    res.on("data", (chunk) => {
      chunks.push(chunk);
    });
    res.on("end", () => {
      setLoading(false);
      console.log(res);
    });
    res.on("error", () => {
      setLoading(false);
    });
    res.on("error", console.error);
    res.pipe(
      fs.createWriteStream(path.join(userDataPath(), "STT_api_output.txt"))
    );
  });

  if (inAudio && inAudio.files) {
    console.log(inAudio.files[0]);
    const postData = `----WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="audio"; filename="${
      inAudio.files[0].path
    }"\r\nContent-Type: ${inAudio.files[0].type}\r\n\r\n${getRandomFileSha1(
      inAudio.files[0].path
    )}\r\n----WebKitFormBoundary7MA4YWxkTrZu0gW--`;

    req.write(postData);
  }
  req.end();
}

/*
req.setHeader(
      "content-type",
      "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    );
mp3	audio/mpeg
*/
