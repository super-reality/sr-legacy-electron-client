import fs from "fs";
import path from "path";
import { nativeImage } from "electron";
import { Rectangle } from "../types/utils";
import userDataPath from "./userDataPath";

export default function cropImage(
  fileName: string,
  rectangle: Rectangle
): Promise<string> {
  const userData = userDataPath();
  const output = `${userData}/crop.png`;

  return new Promise((resolve, reject) => {
    try {
      const image = nativeImage.createFromPath(fileName).crop({
        x: Math.round(rectangle.x),
        y: Math.round(rectangle.y),
        width: Math.round(rectangle.width),
        height: Math.round(rectangle.height),
      });
      fs.writeFile(output, image.toPNG(), {}, () => {
        const timestamped = path.join(userData, `${new Date().getTime()}.png`);
        fs.copyFile(output, timestamped, () => resolve(timestamped));
      });
    } catch (e) {
      reject(e);
    }
  });
}
