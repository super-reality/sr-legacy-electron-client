import fs from "fs";
import path from "path";
import { tempPath } from "../../../electron-constants";

export default function clearTempFolder(): void {
  fs.readdir(tempPath, (err, files) => {
    if (err) console.log(err);
    files.forEach((file) => {
      fs.unlink(path.join(tempPath, file), (e) => {
        if (e) console.log(err);
      });
    });
  });
}
