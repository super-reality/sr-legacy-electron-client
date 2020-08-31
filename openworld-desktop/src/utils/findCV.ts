import { createFindBox } from "../renderer/hooks/useMediaSniper";

export default function findCVMatch(imageUrl: string): void {
  // get x,y, width, height using json-rpc
  createFindBox(100, 100, 200, 200);
}
