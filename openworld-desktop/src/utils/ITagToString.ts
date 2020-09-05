import { ITag } from "../renderer/components/tag-box";

export default function ITagToString(arr: ITag[]): string[] {
  return arr.map((t) => t.name);
}
