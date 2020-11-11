import { IDName } from "../renderer/api/types";

export default function idNamePos(arr: IDName[], id: string): number {
  let ret = -1;
  arr.forEach((d, i) => {
    if (d._id == id) ret = i;
  });
  return ret;
}
