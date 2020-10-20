import path from "path";
import { PythonShell } from "python-shell";
import ipcSend from "../utils/ipcSend";

export default function pythonExecute(args: any): void {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");

  const proc: any = process;
  const publicPath = remote.app.isPackaged
    ? path.join(proc.resourcesPath)
    : path.join(remote.app.getAppPath(), "public");

  console.log("pythonExec", args);
  const options = {
    args,
  };

  PythonShell.run(
    path.join(publicPath, "python", "test.py"),
    options,
    (err, results) => {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      console.log("results: %j", results);
      ipcSend({ method: "pythonResponse", arg: results, to: "renderer" });
    }
  );
}
