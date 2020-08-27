import axios from "axios";
import { ApiError } from "./types";
import LessonCreate, { LessonResp } from "./types/lesson/create";
import { ILesson } from "./types/lesson/lesson";
import { API_URL, timeout } from "../constants";

/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
export default function handleLessonCreate(
  res: ApiError | LessonResp
): Promise<string> {
  return new Promise((resolve, eject) => {
    if (res.err_code == 0) {
      const lessonID: string = res.lesson._id;
      resolve(lessonID);
    } else {
      const errstring = "";
      eject(errstring);
    }
  });
}
export function createLesson(
  bodyData: ILesson
): Promise<ApiError | LessonResp> {
  const defaultToken = window.localStorage.getItem("token");
  return new Promise((resolve, eject) => {
    axios
      .post<ApiError | LessonResp>(`${API_URL}lesson/create`, bodyData, {
        timeout: timeout,
        headers: {
          Authorization: `Bearer ${defaultToken}`,
        },
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        eject(err);
      });
  });
}
