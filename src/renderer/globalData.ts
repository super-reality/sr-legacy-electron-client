// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";
import { ILessonGet } from "./api/types/lesson/get";
import { ISubjectGet } from "./api/types/subject/get";
import { ICollectionGet } from "./api/types/collection/get";
import { Rectangle } from "../types/utils";
import OcrService from "../utils/ocr/ocrService";

const globalData = {
  collections: {} as Record<string, ICollectionGet>,
  subjects: {} as Record<string, ISubjectGet>,
  lessons: {} as Record<string, ILessonGet>,
  backgroundProcess: null as any | null,
  debugCv: true as boolean,
  prevBounds: { x: 0, y: 0, width: 0, height: 0 } as Rectangle,
  audioCutoffTime: 0,
  titleUrlDictionary: {} as Record<string, string>,
  documentKeyDownListeners: {} as Record<string, (e: KeyboardEvent) => void>,
  documentKeyUpListeners: {} as Record<string, (e: KeyboardEvent) => void>,
  mouseX: 0,
  mouseY: 0,
  ocrService: new OcrService(),
};

globalData.ocrService.initialize("eng");

export default globalData;
