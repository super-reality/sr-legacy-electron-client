/* eslint-disable global-require */
import fs from "fs";
import * as cv from "opencv4nodejs";
import screenshot from "../../../utils/screenshot-desktop";

export default function capture() {
  return screenshot({ format: "png" })
    .then((img: Buffer) => {
      const file = fs.readFileSync(
        "C:\\Users\\manuh\\Documents\\GitHub\\OpenWorld\\openworld-desktop\\src\\assets\\images\\cvtest.png"
      );
      const image = cv.imdecode(file);
      const template = cv.imdecode(img);

      const mat = image.matchTemplate(template, cv.TM_SQDIFF);
      const matches = mat.getDataAsArray();
      console.log("matches", matches);
    })
    .catch(console.error);
}
