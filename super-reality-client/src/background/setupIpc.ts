import path from "path";
import { PythonShell } from "python-shell";

export default function setupIpc(): void {
  console.log("Initialize IPC handlers");
  // eslint-disable-next-line global-require
  const { ipcRenderer } = require("electron");

  ipcRenderer.on("pythonExec", (e: any, args: string[]) => {
    const options = {
      args,
    };

    PythonShell.run("my_script.py", options, (err, results) => {
      if (err) throw err;
      // results is an array consisting of messages collected during execution
      console.log("results: %j", results);
    });
  });
}
