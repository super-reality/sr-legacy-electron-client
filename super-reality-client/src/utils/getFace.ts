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
  // eslint-disable-next-line
  const { formData } = require("form-data");

  const form = new FormData();
  if (image && image.files && video && video.files) {
    form.append("image", image.files[0]);
    form.append("video", video.files[0]);

    console.log(form.get("Headers"));
    const getVideo = async () => {
      const response = await fetch("http://54.219.193.178:8080/face_api", {
        method: "POST",
        body: form,
      });
      const videoFile = await response.body;
      const blob = await response.blob();
      setLoading(false);

      const buffer = Buffer.from(await blob.arrayBuffer());

      fs.writeFile(
        path.join(userDataPath(), "Face_api_output.mp4"),
        buffer,
        () => console.log("video saved!")
      );

      console.log(videoFile);
    };
    getVideo();
  }
}
  /*
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
      Accept: "**",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
      "Content-Length": 459,
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
    const postData = `----WebKitFormBoundary${getRandomFileSha1(
      image.files[0].path
    )}\r\nContent-Disposition: form-data; name="image"; filename=${
      image.files[0].path
    }\r\nContent-Type: ${image.files[0].type}\r\n\r\n${fs.createReadStream(
      image.files[0].path
    )}\r\n----WebKitFormBoundary${getRandomFileSha1(
      image.files[0].path
    )}\r\nContent-Disposition: form-data; name="video"; filename=${
      video.files[0].path
    }\r\nContent-Type: ${video.files[0].type}\r\n\r\n${fs.createReadStream(
      video.files[0].path
    )}\r\n----WebKitFormBoundary${getRandomFileSha1(image.files[0].path)}`;

    console.log(postData);
    console.log(req);

    req.write(postData);
  }
  console.log(req);
  req.end();
  */


