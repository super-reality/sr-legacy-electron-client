/* eslint-disable camelcase */
import { CodeSuccess, ApiSucess } from "..";
import { IChapter } from "./chapter";

export interface ChaptersGet extends ApiSucess {
  err_code: CodeSuccess;
  chapters: IChapter[];
}

export interface ChapterGet extends ApiSucess {
  err_code: CodeSuccess;
  chapters: IChapter;
}
