import fs from "fs";
import {
  itemsPath,
  recordingPath,
  stepPath,
  stepSnapshotPath,
} from "../renderer/electron-constants";

function makeDataDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, (err) => {
      if (err) console.log("error", err);
    });
  }
}

export default function createDataDirs() {
  makeDataDir(stepPath);
  makeDataDir(recordingPath);
  makeDataDir(stepSnapshotPath);
  makeDataDir(itemsPath);
}
