import { CodeSuccess } from "..";

// type ParentType = "subject" | "lesson";

interface Subject {
  type: "subject";
  collectionId: string;
  collectionName: string;
  subjectId: string;
  subjectName: string;
  lessonId: undefined;
  lessonName: undefined;
}

interface Lesson {
  type: "lesson";
  collectionId: undefined;
  collectionName: undefined;
  subjectId: string;
  subjectName: string;
  lessonId: string;
  lessonName: string;
}

export type Parents = Subject | Lesson;

/* eslint-disable camelcase */
export default interface LessonSearchParent {
  err_code: CodeSuccess;
  parents: Parents[];
}
