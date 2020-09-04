import { CodeSuccess } from "..";
import constant from "../../constant";

export const CollectionSortOptions = {};

export interface ICollectionSearch {
  medias: string[];
  _id: string;
  createdAt: string;
  icon: string;
  name: string;
  description: string;
  shortDescription: string;
  rating: number;
}

/* eslint-disable camelcase */
export default interface CollectionSearch {
  err_code: CodeSuccess;
  type: "collection";
  collections: ICollectionSearch[];
}
