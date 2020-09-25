import { ITag } from "../renderer/components/tag-box";
import Link from "../renderer/api/types/link/link";

export default function ITagToLink(arr: ITag[]): Link[] {
  return arr.map((t) => {
    return {
      _id: t.id,
      type: t.name as Link["type"],
    };
  });
}
