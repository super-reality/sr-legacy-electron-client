import { CodeSuccess } from "..";
import constant from "../../constant";

export const SubjectSortOptions = {
  "Most Popular": constant.Subject_Sort.Most_Popular,
  "Most Lesson": constant.Subject_Sort.Most_Lesson,
  Newest: constant.Subject_Sort.Newest,
  Oldest: constant.Subject_Sort.Oldest,
  "My Teacher": constant.Subject_Sort.My_Teacher,
  "Highest Avg": constant.Subject_Sort.Highest_Avg,
  "Highest Score": constant.Subject_Sort.Highest_Score,
  "Highest Trans": constant.Subject_Sort.Highest_Trans,
};

export interface ISubjectSearch {
  medias: string[];
  _id: string;
  createdAt: string;
  icon: string;
  name: string;
  shortDescription: string;
}

/* eslint-disable camelcase */
export default interface SubjectSearch {
  err_code: CodeSuccess;
  type: "subject";
  subjects: ISubjectSearch[];
}
