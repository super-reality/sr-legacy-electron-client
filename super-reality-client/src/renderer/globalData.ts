import { ILessonGet } from "./api/types/lesson/get";
import { ISubjectGet } from "./api/types/subject/get";
import { ICollectionGet } from "./api/types/collection/get";
import { ILessonV2 } from "./api/types/lesson-v2/lesson";
import { Item } from "./api/types/item/item";
import { IChapter } from "./api/types/chapter/chapter";
import { IAnchor } from "./api/types/anchor/anchor";
import { IStep } from "./api/types/step/step";

const globalData = {
  collections: {} as Record<string, ICollectionGet>,
  subjects: {} as Record<string, ISubjectGet>,
  lessons: {} as Record<string, ILessonGet>,
  cvFindWindow: null as any | null,
  debugCv: false as boolean,
  lessonsv2: {} as Record<string, ILessonV2>,
  chapters: {} as Record<string, IChapter>,
  steps: {} as Record<string, IStep>,
  items: {} as Record<string, Item>,
  anchors: {} as Record<string, IAnchor>,
};

export default globalData;
