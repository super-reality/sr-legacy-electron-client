import Axios from "axios";
import fs from "fs";
import handleGetFace from "../renderer/api/handleGetFace";
import setLoading from "../renderer/redux/utils/setLoading";
import downloadFile from "./downloadFIle";

// export default function getFace(image: string, video: string): void {
export default function getFace(
  image: HTMLInputElement,
  video: HTMLInputElement
): void {
  // eslint-disable-next-line global-require
  const { app, remote } = require("electron");
  const userData = (app || remote.app).getPath("userData").replace(/\\/g, "/");
  const filename = `${userData}/output.mp4`;

  const data = new FormData();
  // data.append('image', fs.createReadStream('/C:/Users/Desktop/face.jpg'));
  // data.append('video', fs.createReadStream('/C:/Users/Desktop/video.mp4'));

  if (image.files) data.append("image", image.files[0]);
  if (video.files) data.append("video", video.files[0]);

  setLoading(true);

  Axios.post<string>(`http://3.101.43.24:5000/face_api`, data, {
    timeout: 1000 * 60,
  })
    .then((response) => {
      console.log(response);
      setLoading(false);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "file.mp4");
      document.body.appendChild(link);
      link.click();
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
