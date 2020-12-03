import { Rectangle } from "../../types/utils";
import getPrimaryMonitor from "./getPrimaryMonitor";

export default function getPrimaryPos(
  bounds: Rectangle
): { x: number; y: number } {
  const primaryBounds = getPrimaryMonitor().bounds;
  console.log("bounds", bounds);
  console.log("primaryBounds", primaryBounds);
  const primaryPos = { x: 0, y: 0 };
  primaryPos.x = primaryBounds.x - bounds.x;
  primaryPos.y = primaryBounds.y - bounds.y;
  console.log("getPrimaryPos", primaryPos);
  return primaryPos;
}
