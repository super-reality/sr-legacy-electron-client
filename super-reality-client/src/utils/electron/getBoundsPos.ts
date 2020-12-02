import { Rectangle } from "../../types/utils";

export default function getBoundsPos(
  bounds: Rectangle,
  windowRect?: Rectangle
): { x: number; y: number } {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  const windowBounds = windowRect || remote.getCurrentWindow().getBounds();
  const primaryPos = { x: 0, y: 0 };
  primaryPos.x = windowBounds.x - bounds.x;
  primaryPos.y = windowBounds.y - bounds.y;
  console.log("bounds", bounds);
  console.log("windowBounds", windowBounds);
  console.log("getPrimaryPos", primaryPos);
  return primaryPos;
}
