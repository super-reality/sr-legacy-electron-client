import { CodeSuccess } from "..";
import { IChapter } from "./chapter";

/* eslint-disable camelcase */
export default interface ChapterCreate {
  err_code: CodeSuccess;
  data: IChapter;
}
