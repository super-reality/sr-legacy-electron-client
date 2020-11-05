import fs from "fs";
import userDataPath from "./userDataPath";

export default function createDataDirs() {
  const userData = userDataPath();
  const stepPath = `${userData}/step/`;
  const recordingPath = `${userData}/step/media/`;

  const stepSnapshotPath = `${userData}/step/snapshots/`;
  if (!fs.existsSync(stepPath)) {
    fs.mkdir(stepPath, (err) => {
      if (err) console.log("error", err);
    });
  }
  if (!fs.existsSync(recordingPath)) {
    fs.mkdir(recordingPath, (err) => {
      if (err) console.log("error", err);
    });
  }
  if (!fs.existsSync(stepSnapshotPath)) {
    fs.mkdir(stepSnapshotPath, (err) => {
      if (err) console.log("error", err);
    });
  }
}
