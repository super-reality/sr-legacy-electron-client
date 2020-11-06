import fs from "fs";
import path from "path";
import http from "http";


import setLoading from "../renderer/redux/utils/setLoading";
import userDataPath from "./userDataPath";

// export default function getFace(image: string, video: string): void {
export default function getSTT(inAudio: HTMLInputElement): void {
  if (inAudio && inAudio.files) {
    console.log(inAudio.files[0].path);
  }
  setLoading(true);
  const options = {
    method: "POST",
    hostname: "54.219.193.178",
    port: 8080,
    path: "/face_api",
    headers: {},
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
    const postData = `----WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="audio"; filename="${
      inAudio.files[0].path
    }"\r\nContent-Type: "audio/webm"\r\n\r\n${fs.createReadStream(
      inAudio.files[0].path
    )}\r\n----WebKitFormBoundary7MA4YWxkTrZu0gW--`;

    req.setHeader(
      "content-type",
      "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    );

    req.write(postData);
  }
  req.end();
}

/*
mp3	audio/mpeg
*/
