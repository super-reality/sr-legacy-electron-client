import { CodeSuccess } from "..";
import constant from "../../constant";

export const LessonSortOptions = {
  Newest: constant.Lesson_Sort.Newest,
  Oldest: constant.Lesson_Sort.Oldest,
  "Highest Avg.": constant.Lesson_Sort.Highest_Avg,
  "Lowest Avg.": constant.Lesson_Sort.Lowest_Avg,
  Intro: constant.Lesson_Sort.Intro,
  Beginner: constant.Lesson_Sort.Beginner,
  Intermediate: constant.Lesson_Sort.Intermediate,
  Advanced: constant.Lesson_Sort.Advanced,
};

export interface ILessonSearch {
  medias: string[];
  _id: string;
  createdAt: string;
  icon: string;
  name: string;
  shortDescription: string;
  description: string;
  rating: number;
  totalSteps: string[];
}

/* eslint-disable camelcase */
export default interface LessonSearch {
  err_code: CodeSuccess;
  type: "lesson";
  lessons: ILessonSearch[];
}
