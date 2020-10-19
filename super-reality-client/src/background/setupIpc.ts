import path from "path";
import { PythonShell } from "python-shell";

export default function setupIpc(): void {
  console.log("Initialize Background IPC handlers");
  // eslint-disable-next-line global-require
  const { remote, ipcRenderer } = require("electron");

  const proc: any = process;
  const publicPath = remote.app.isPackaged
    ? path.join(proc.resourcesPath)
    : path.join(remote.app.getAppPath(), "public");

  ipcRenderer.on("pythonExec", (event: any, args: string[]) => {
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
        event.sender.send("pythonResult", results);
      }
    );
  });
}
