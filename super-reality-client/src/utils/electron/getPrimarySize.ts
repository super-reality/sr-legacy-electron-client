import { Rectangle } from "../../types/utils";
import getPrimaryMonitor from "./getPrimaryMonitor";

export default function getPrimarySize(): Rectangle {
  return getPrimaryMonitor().bounds;
}
