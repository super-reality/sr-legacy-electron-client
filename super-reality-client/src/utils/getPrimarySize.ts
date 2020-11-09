import { Rectangle } from "../types/utils";

export default function getPrimarySize(
  bounds: Rectangle
): { width: number; height: number } {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  return remote.screen.getPrimaryDisplay().bounds;
}
