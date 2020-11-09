import { IDName } from "../renderer/api/types";

export default function idInIdName(arr: IDName[], id: string): boolean {
  return arr.filter((d) => d._id == id).length > 0;
}
