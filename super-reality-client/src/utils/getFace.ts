import Axios from "axios";
import fs from "fs";
import handleGetFace from "../renderer/api/handleGetFace";
import setLoading from "../renderer/redux/utils/setLoading";
import downloadFile from "./downloadFIle";

export default function getFace(image: string, video: string): void {
  // eslint-disable-next-line global-require
  const { app, remote } = require("electron");
  const userData = (app || remote.app).getPath("userData").replace(/\\/g, "/");
  const filename = `${userData}/output.mp4`;

  const data = new FormData();

  const imageFileContent = fs.readFileSync(image);
  const imageFile = new File([imageFileContent], image);
  data.append("image", imageFile);

  const videoFileContent = fs.readFileSync(image);
  const videoFile = new File([videoFileContent], image);
  data.append("video", videoFile);

  setLoading(true);

  Axios.post<string>(`http://3.101.43.24:5000/face_api`, data)
    .then(handleGetFace)
    .then((d) => {
      console.log(d);
      setLoading(false);
      /*
      downloadFile(url, filename)
        .then(console.log)
        .catch(console.error);
      */
    })
    .catch((err) => {
      setLoading(false);
    });
}
