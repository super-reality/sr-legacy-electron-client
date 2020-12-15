import fs from "fs";
import {
  fxPath,
  itemsPath,
  recordingPath,
  stepPath,
  stepSnapshotPath,
  tempPath,
} from "../../renderer/electron-constants";

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
  return makeDataDir(stepPath)
    .then(() => makeDataDir(recordingPath))
    .then(() => makeDataDir(stepSnapshotPath))
    .then(() => makeDataDir(itemsPath))
    .then(() => makeDataDir(tempPath))
    .then(() => makeDataDir(fxPath));
}
