import { ipcRenderer } from "electron";

export default function testIpc(): void {
  ipcRenderer.on("ping", (e: any, args: any) => {
    ipcRenderer.send("pong", true);
  });
}
