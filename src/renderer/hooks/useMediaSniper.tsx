/* eslint-disable global-require */
import { useCallback } from "react";
import path from "path";
import fs from "fs";
import createDetachedWindow from "../../utils/createDetachedWindow";
import screenshotcapture from "../../utils/screencapture";
import setLoading from "../redux/utils/setLoading";

export default function useMediaSniper(
  onFinish: (url: string) => void
): () => void {
  const open = useCallback(() => {
    setLoading(true);
    // eslint-disable-next-line global-require
    const { app, remote } = require("electron");
    const userData = (app || remote.app).getPath("userData");

    const fileName = path.join(userData, "capture.png").replace(/\\/g, "/");
    screenshotcapture(fileName, () => {
      createDetachedWindow(
        {
          fullscreen: true,
          frame: false,
          focus: true,
          width: 800,
          height: 600,
        },
        { arg: fileName, type: "SNIPING_TOOL" }
      ).then(() => {
        setLoading(false);
        const crop = path.join(userData, "crop.png");
        const timestamped = path.join(userData, `${new Date().getTime()}.png`);
        fs.copyFile(crop, timestamped, () => onFinish(timestamped));
      });
    });
  }, [onFinish]);

  return open;
}
