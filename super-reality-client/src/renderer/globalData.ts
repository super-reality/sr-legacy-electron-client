import { ILessonGet } from "./api/types/lesson/get";
import { ISubjectGet } from "./api/types/subject/get";
import { ICollectionGet } from "./api/types/collection/get";
import {
  IAnchor,
  IChapterGet,
  ILessonV2Get,
  IStepGet,
} from "./api/types/lesson-v2/lesson";
import { Item } from "./api/types/lesson-v2/item";

const globalData = {
  collections: {} as Record<string, ICollectionGet>,
  subjects: {} as Record<string, ISubjectGet>,
  lessons: {} as Record<string, ILessonGet>,
  cvFindWindow: null as any | null,
  debugCv: false as boolean,
  lessonsv2: {} as Record<string, ILessonV2Get>,
  chapters: {} as Record<string, IChapterGet>,
  steps: {} as Record<string, IStepGet>,
  items: {} as Record<string, Item>,
  anchors: {} as Record<string, IAnchor>,
};

export default globalData;
