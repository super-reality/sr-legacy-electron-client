/* eslint-disable camelcase */
// import constants from "../../../../../openworld-server/config/constant";

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

export type ErrorCodes =
  | CodeSuccess
  | CodeUserNameWrong
  | CodeUserPasswordWrong
  | CodeUserAlreadyExist;

export type UserAdmin = 1;
export type UserClient = 2;

export type Users = UserAdmin | UserClient;

export interface ApiError {
  err_code: Exclude<ErrorCodes, CodeSuccess>;
  salt?: string;
  hash?: string;
  msg: string;
}
