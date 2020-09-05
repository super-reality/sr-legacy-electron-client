import Link from "../link/link";
import { ITag } from "../../../components/tag-box";

export interface ISubject {
  _id?: string;
  parent: ITag[];
  icon: string;
  name: string;
  shortDescription: string;
  description: string;
  medias: string[];
  tags: ITag[];
  visibility: Link[];
  entry: number;
}
