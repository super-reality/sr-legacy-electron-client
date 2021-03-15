import path from "path";
import { PythonShell } from "python-shell";
import getPublicPath from "../utils/electron/getPublicPath";
import ipcSend from "../utils/ipcSend";

export default function pythonExecute(args: any): void {
  const options = {
    args,
  };

  PythonShell.run(
    path.join(getPublicPath(), "python", "test.py"),
    options,
    (err, results) => {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      ipcSend({ method: "pythonResponse", arg: results, to: "renderer" });
    }
  );
}
