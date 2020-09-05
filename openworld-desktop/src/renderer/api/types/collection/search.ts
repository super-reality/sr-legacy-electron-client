import { CodeSuccess } from "..";
import constant from "../../constant";

export const CollectionSortOptions = {
  "Most Popular": constant.Collection_Sort.Most_Popular,
  Lessons: constant.Collection_Sort.Most_Lesson,
  Newest: constant.Collection_Sort.Newest,
  Oldest: constant.Collection_Sort.Oldest,
  "My Teacher": constant.Collection_Sort.My_Teacher,
  "Highest Avg.": constant.Collection_Sort.Highest_Avg,
  "Highest Score": constant.Collection_Sort.Highest_Score,
  "Highest Trans": constant.Collection_Sort.Highest_Trans,
};

export interface ICollectionSearch {
  medias: string[];
  _id: string;
  createdAt: string;
  icon: string;
  name: string;
  description: string;
  shortDescription: string;
  rating: number;
  subjectCount: number;
}

/* eslint-disable camelcase */
export default interface CollectionSearch {
  err_code: CodeSuccess;
  type: "collection";
  collections: ICollectionSearch[];
}
