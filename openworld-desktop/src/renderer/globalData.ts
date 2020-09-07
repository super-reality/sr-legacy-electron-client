import { ILessonGet } from "./api/types/lesson/get";
import { ISubjectGet } from "./api/types/subject/get";
import { ICollectionGet } from "./api/types/collection/get";

const globalData = {
  collections: {} as Record<string, ICollectionGet>,
  subjects: {} as Record<string, ISubjectGet>,
  lessons: {} as Record<string, ILessonGet>,
};

export default globalData;
