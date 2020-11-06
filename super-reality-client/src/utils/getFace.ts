import fs from "fs";
import path from "path";
import http from "http";
import setLoading from "../renderer/redux/utils/setLoading";
import userDataPath from "./userDataPath";
import getRandomFileSha1 from "./getRandomFileSha1";

// export default function getFace(image: string, video: string): void {
export default function getFace(
  image: HTMLInputElement,
  video: HTMLInputElement
): void {
  setLoading(true);
  const random = Math.random().toString();
  const options = {
    method: "POST",
    hostname: "54.219.193.178",
    port: 8080,
    path: "/face_api",
    headers: {
      "Content-Type":
        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      Host: `sp${random}.com`,
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
    });
    res.on("error", console.error);

    res.pipe(
      fs.createWriteStream(path.join(userDataPath(), "Face_api_output.mp4"))
    );
  });

  if (image && image.files && video && video.files) {
    const postData = `------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="image"; filename="${
      image.files[0].path
    }"\r\nContent-Type: ${image.files[0].type}\r\n\r\n${getRandomFileSha1(
      image.files[0].path
    )}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name="video"; filename="${
      video.files[0].path
    }"\r\nContent-Type: ${video.files[0].type}\r\n\r\n${getRandomFileSha1(
      video.files[0].path
    )}\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--`;

    req.write(postData);
  }
  req.end();
}
/*
req.setHeader(
      "content-type",
      "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
    );
    */
