import Link from "../link/link";

export interface ICollection {
  icon: string;
  name: string;
  shortDescription: string;
  description: string;
  medias: string[];
  tags: string[];
  visibility: Link[];
  entry: number;
}
