/* eslint-disable global-require */
import { useCallback } from "react";

export default function useMediaInsert(
  onFinish: (url: string) => void
): () => void {
  const open = useCallback(() => {
    const { remote } = require("electron");
    remote.dialog
      .showOpenDialog(remote.getCurrentWindow(), {
        properties: ["openFile"],
        filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
      })
      .then((ret: any) => {
        // onFinish(ret.filePaths[0]);
        if (!ret.canceled) onFinish(ret.filePaths[0].replace(/\\/g, "/"));
      });
  }, [onFinish]);

  return open;
}
