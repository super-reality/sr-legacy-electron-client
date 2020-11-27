import fs from "fs";
import {
  itemsPath,
  recordingPath,
  stepPath,
  stepSnapshotPath,
  tempPath,
} from "../../renderer/electron-constants";

function makeDataDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, (err) => {
      if (err) throw err;
    });
  }
}

export default function createDataDirs() {
  makeDataDir(stepPath);
  makeDataDir(recordingPath);
  makeDataDir(stepSnapshotPath);
  makeDataDir(itemsPath);
  makeDataDir(tempPath);

  return true;
}
