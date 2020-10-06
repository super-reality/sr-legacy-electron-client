/* eslint-disable camelcase */

import CollectionGet, { ICollectionGet } from "./collection/get";
import SubjectGet, { ISubjectGet } from "./subject/get";
import LessonGet, { ILessonGet } from "./lesson/get";

export type CategoryAll = 0;
export type CategoryLesson = 1;
export type CategorySubject = 2;
export type CategoryOrganization = 3;
export type CategoryCollection = 4;
export type CategoryTeacher = 5;
export type CategoryStudent = 6;
export type CategoryJobPost = 7;
export type CategoryProject = 8;
export type CategoryResource = 9;
export type CategoryTeacherBot = 10;

export type Categories =
  | CategoryAll
  | CategoryLesson
  | CategorySubject
  | CategoryOrganization
  | CategoryCollection
  | CategoryTeacher
  | CategoryStudent
  | CategoryJobPost
  | CategoryProject
  | CategoryResource
  | CategoryTeacherBot;

export type CodeSuccess = 0;
export type CodeUserNameWrong = 101;
export type CodeUserPasswordWrong = 102;
export type CodeUserAlreadyExist = 103;
export type CodeRequireFieldMissing = 104;

export type ErrorCodes =
  | CodeSuccess
  | CodeUserNameWrong
  | CodeUserPasswordWrong
  | CodeUserAlreadyExist;

export type StatusBadRequest = 400;
export type StatusUnauthorized = 401;
export type StatusForbidden = 403;
export type StatusNotFound = 404;
export type StatusMethodNotAllowed = 405;
export type StatusNotAcceptable = 406;
export type StatusRequestTimeout = 408;
export type StatusUnsupportedMediaType = 415;
export type StatusUnavailableForLegalReasons = 451;
export type StatusInternalServerError = 500;
export type StatusNotImplemented = 501;
export type StatusServiceUnavailable = 503;

export type StatusCodes =
  | StatusBadRequest
  | StatusUnauthorized
  | StatusForbidden
  | StatusNotFound
  | StatusMethodNotAllowed
  | StatusNotAcceptable
  | StatusRequestTimeout
  | StatusUnsupportedMediaType
  | StatusUnavailableForLegalReasons
  | StatusInternalServerError
  | StatusNotImplemented
  | StatusServiceUnavailable;

export type UserAdmin = 1;
export type UserClient = 2;

export type Users = UserAdmin | UserClient;

export interface ApiError {
  err_code: Exclude<ErrorCodes, CodeSuccess>;
  salt?: string;
  hash?: string;
  msg: string;
}

export interface ApiSucess {
  err_code: CodeSuccess;
}

export interface ApiOk {
  err_code: CodeSuccess;
  msg: string;
}

interface CollectionApi {
  type: "collection";
  data?: ICollectionGet;
  api?: CollectionGet;
}

interface SubjectApi {
  type: "subject";
  data?: ISubjectGet;
  api?: SubjectGet;
}

interface LessonApi {
  type: "lesson";
  data?: ILessonGet;
  api?: LessonGet;
}

export interface IDName {
  _id: string;
  name: string;
}

export type ApiJoin = CollectionApi | SubjectApi | LessonApi;
