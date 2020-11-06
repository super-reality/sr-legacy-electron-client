import fs from "fs";
import path from "path";
import http from "http";
import setLoading from "../renderer/redux/utils/setLoading";
import userDataPath from "./userDataPath";

export default function getAvatar(
  inAudio: HTMLInputElement,
  video: HTMLInputElement
): void {
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
      console.log(res);
      setLoading(false);
    });
    res.on("error", console.error);

    res.pipe(
      fs.createWriteStream(path.join(userDataPath(), "Avatar_api_output.qt"))
    );
  });

  if (inAudio && inAudio.files && video && video.files) {
    const postData = `------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="audio"; filename="${
      inAudio.files[0].path
    }"\r\nContent-Type: "audio/webm"\r\n\r\n${fs.readFileSync(
      inAudio.files[0].path
    )}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="video"; filename="${
      video.files[0].path
    }"\r\nContent-Type: "video/mp4"\r\n\r\n${fs.readFileSync(
      video.files[0].path
    )}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--`;

    req.setHeader(
      "content-type",
      "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    );

    req.write(postData);
  }
  req.end();
}
