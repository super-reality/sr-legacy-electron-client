import { remote } from "electron";
import { useCallback } from "react";

export default function useMediaSniper(
  onFinish: (url: string) => void
): () => void {
  const open = useCallback(() => {
    remote.dialog
      .showOpenDialog(remote.getCurrentWindow(), {
        properties: ["openFile"],
        filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg"] }],
      })
      .then((ret) => {
        // onFinish(ret.filePaths[0]);
        if (!ret.canceled)
          onFinish(`"${ret.filePaths[0].replace(/\\/g, "/")}"`);
      });
  }, []);

  return open;
}
