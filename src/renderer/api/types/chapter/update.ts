import { CodeSuccess, ApiSucess } from "..";
import { IChapter } from "./chapter";

/* eslint-disable camelcase */
export default interface ChapterUpdate extends ApiSucess {
  err_code: CodeSuccess;
  chapter: IChapter;
}
