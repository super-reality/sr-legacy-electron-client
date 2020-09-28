import { CodeSuccess } from "..";

export interface Collection {
  type: "collection";
  collectionId: string;
  collectionName: string;
  subjectId: undefined;
  subjectName: undefined;
  lessonId: undefined;
  lessonName: undefined;
}

export interface Subject {
  type: "subject";
  collectionId: string;
  collectionName: string;
  subjectId: string;
  subjectName: string;
  lessonId: undefined;
  lessonName: undefined;
}

export interface Lesson {
  type: "lesson";
  collectionId: undefined;
  collectionName: undefined;
  subjectId: string;
  subjectName: string;
  lessonId: string;
  lessonName: string;
}

export type Parents = Subject | Lesson | Collection;

/* eslint-disable camelcase */
export default interface LessonSearchParent {
  err_code: CodeSuccess;
  parents: Parents[];
}
