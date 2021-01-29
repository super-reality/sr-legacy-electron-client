import Link from "../link/link";
import { ITag } from "../../../components/tag-box";

export interface ICollection {
  _id?: string;
  icon: string;
  name: string;
  shortDescription: string;
  description: string;
  medias: string[];
  tags: ITag[];
  visibility: Link[];
  entry: number;
  subjects?: number;
}
