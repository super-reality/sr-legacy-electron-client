import { ILessonGet } from "./api/types/lesson/get";
import { ISubjectGet } from "./api/types/subject/get";
import { ICollectionGet } from "./api/types/collection/get";
import { Rectangle } from "../types/utils";

const globalData = {
  collections: {} as Record<string, ICollectionGet>,
  subjects: {} as Record<string, ISubjectGet>,
  lessons: {} as Record<string, ILessonGet>,
  cvFindWindow: null as any | null,
  backgroundProcess: null as any | null,
  debugCv: true as boolean,
  prevBounds: { x: 0, y: 0, width: 0, height: 0 } as Rectangle,
};

export default globalData;
