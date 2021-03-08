import fs from "fs";
import {
  fxPath,
  itemsPath,
  ocrCachePath,
  recordingPath,
  stepPath,
  stepSnapshotPath,
  tempPath,
} from "../../renderer/electron-constants";
import userDataPath from "./userDataPath";

function makeDataDir(dir: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, (err) => {
        if (err) reject(err);
        else resolve(true);
      });
    } else {
      resolve(true);
    }
  });
}

export default function createDataDirs(): Promise<boolean> {
  console.log("USER DATA PATH", userDataPath());
  return makeDataDir(stepPath)
    .then(() => makeDataDir(recordingPath))
    .then(() => makeDataDir(stepSnapshotPath))
    .then(() => makeDataDir(itemsPath))
    .then(() => makeDataDir(tempPath))
    .then(() => makeDataDir(fxPath))
    .then(() => makeDataDir(ocrCachePath));
}
