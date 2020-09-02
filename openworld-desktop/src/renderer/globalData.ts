import { ILessonGet } from "./api/types/lesson/get";

const globalData = {
  collections: {} as Record<string, any>,
  subjects: {} as Record<string, any>,
  lessons: {} as Record<string, ILessonGet>,
};

export default globalData;
