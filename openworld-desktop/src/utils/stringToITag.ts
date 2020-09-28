import { ITag } from "../renderer/components/tag-box";

export default function stringToITag(arr: string[]): ITag[] {
  return arr.map((t) => {
    return {
      name: t,
      id: t,
    };
  });
}
