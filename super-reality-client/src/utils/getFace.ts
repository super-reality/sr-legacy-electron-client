import fs from "fs";
import path from "path";
import http from "http";
import setLoading from "../renderer/redux/utils/setLoading";
import userDataPath from "./userDataPath";
import getRandomFileSha1 from "./getRandomFileSha1";

// function to get the Face from the video and the image file
export default function getFace(
  image: HTMLInputElement,
  video: HTMLInputElement
): void {
  setLoading(true);
  // eslint-disable-next-line global-require
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
