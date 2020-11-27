import { Rectangle } from "../../types/utils";

export default function getPrimaryPos(
  bounds: Rectangle
): { x: number; y: number } {
  // eslint-disable-next-line global-require
  const { remote } = require("electron");
  const primaryBounds = remote.screen.getPrimaryDisplay().bounds;
  console.log("bounds", bounds);
  console.log("primaryBounds", primaryBounds);
  const primaryPos = { x: 0, y: 0 };
  primaryPos.x = primaryBounds.x - bounds.x;
  primaryPos.y = primaryBounds.y - bounds.y;
  console.log("getPrimaryPos", primaryPos);
  return primaryPos;
}
