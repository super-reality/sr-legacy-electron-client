import path from "path";
import getPublicPath from "../electron/getPublicPath";

export default function pathToFfmpeg(): string {
  return path.join(getPublicPath(), "extra", "ffmpeg.exe");
}
