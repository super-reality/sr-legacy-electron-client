import { CodeSuccess, ApiSucess } from "..";
import Link from "../link/link";
import { ISubjectGet } from "../subject/get";

export interface ICollectionGet {
  tags: string[];
  medias: string[];
  visibility: Link[];
  options: Link[];
  _id: string;
  createdAt: string;
  icon: string;
  name: string;
  shortDescription: string;
  description: string;
  entry: number;
  numberOfShares: number;
  numberOfActivations: number;
  createdBy: string;
}

/* eslint-disable camelcase */
export default interface CollectionGet extends ApiSucess {
  err_code: CodeSuccess;
  collection: ICollectionGet;
  subjects: ISubjectGet[];
}
