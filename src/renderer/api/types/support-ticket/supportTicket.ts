/* eslint-disable camelcase */
import { CodeSuccess } from "..";

const START = 0;
const HELP = 1;

type TSupportScreen = typeof START | typeof HELP;

const MENU = 0;
const ASK = 1;
const SEARCH = 2;

type TSupportOption = typeof MENU | typeof ASK | typeof SEARCH;

export interface IFile {
  lastModified: number;
  name: string;
  path: string;
  size: number;
  type: string;
}

export interface IGetUpvotedTickets {
  err_code: CodeSuccess;
  upvotes: string[];
  downvotes: string[];
}

export interface IVibe {
  _id: string;
  title: string;
  level: number;
}

export interface IGetVibe {
  _id: string;
  title: string;
  emoji: string;
  type: string;
}
export interface IGetVibesObjectResult {
  positiveVibes: IGetVibe[];
  negativeVibes: IGetVibe[];
}

export interface IGetVibes {
  err_code: CodeSuccess;
  result: IGetVibesObjectResult;
}

export interface ISearchSupportTickets {
  name?: string;
  category?: string;
  limit?: number;
}

export interface IVibeRating {
  name: string;
  emoji: string;
}

export interface IVibeRatings {
  vibes: IVibeRating[];
}

export interface IData {
  name: string;
  _id: string;
  new?: boolean;
}

export interface IDataGet {
  name: string;
  _id: string;
}

export interface ISkillsGet {
  err_code: CodeSuccess;
  skill: IDataGet[];
}

export interface ICategoriesGet {
  err_code: CodeSuccess;
  category: IDataGet[];
}

export interface ICategoryGet {
  err_code: CodeSuccess;
  category: IData[];
}

export interface ISkill {
  name: string;
  _id: string;
}

export interface ISkillGet {
  err_code: CodeSuccess;
  name: string;
  _id: string;
}

export interface IVotePayload {
  votes: number;
  upvote: boolean;
  downvote: boolean;
}

export interface ISubcategory {
  _id: string;
  name: string;
  skills: { _id: string; name: string }[];
}

export interface ISingleCategoryGet {
  err_code: CodeSuccess;
  category: {
    _id: string;
    name: string;
    subcategories: ISubcategory[];
  };
}

export interface Ioptions {
  id: string;
  name: string;
}

export interface Icategory {
  name: string;
  id: string;
}

export interface tags {
  name: string;
}

interface option {
  name: string;
  description: string;
}

interface category {
  name: string;
}

interface requestCategory {
  name: string;
  tags: tags[];
}

export type TsupportType =
  | "help_short"
  | "help_long"
  | "build"
  | "question"
  | ""
  | undefined;

export default interface supportTicket {
  supportType: TsupportType;
  title: string;
  category: string;
  skills: string[];
  description: string;
  images?: File[];
  newSkill?: boolean;
  newSkills?: string[];
  newCategory?: boolean;
  newCategoryName?: string;
  skillsData: IData[];
  searchedSkills: IData[];
  categoryData: IData[];
  subcategories: ISubcategory[];
  vibeData: IGetVibesObjectResult;
  vibes: IVibe[];
}

export interface supportTicketPayload {
  title: string;
  supportType: TsupportType;
  supportCategory?: string;
  description: string;
  files?: string[];
  skills: string[];
  newCategory?: boolean;
  newCategoryName?: string;
  newSkill?: boolean;
  newSkillName?: string;
  createdAt?: string;
  _id?: string;
  vibes: string[];
  vibesLevels: number[];
  votes?: number;
}

export interface supportTicketsGet {
  err_code: CodeSuccess;
  tickets: supportTicketPayload[];
}

export interface supportTicketsSearch {
  err_code: CodeSuccess;
  tickets: supportTicketPayload[];
}

export interface supportTicketPayloadGet {
  err_code: CodeSuccess;
  ticket: supportTicketPayload;
}

export interface singleSupportTicketsPayload {
  title: string;
  supportType: TsupportType;
  description: string;
  files?: string[];
  skills: string[];
  createdAt: string;
  creatorInfo: {
    firstname: string;
    lastname: string;
    username: string;
  };
  _id: string;
  vibes: string[];
  vibesLevels: number[];
  category: {
    name: string;
    _id: string;
  };
  skill: { name: string; _id: string }[];
}

export interface singleSupportTicketsGet {
  err_code: CodeSuccess;
  ticket: singleSupportTicketsPayload;
  category: {
    name: string;
    _id: string;
  };
  skill: { name: string; _id: string }[];
  votes: number;
}

export interface IPostComment {
  ticketId: string;
  comment: string;
}
export interface IPostNestedComment {
  parentId: string;
  comment: string;
}
export interface IComment {
  userId: string;
  username: string;
  comment: string;
  timePostted: string;
  _id: string;
  ranking: 0;
  nestedCommentsCount: 0;
  nestedComments?: [];
}

export interface IGetComment {
  err_code: CodeSuccess;
  comment: IComment;
}

export interface IGetComments {
  err_code: CodeSuccess;
  comments: {
    userId: string;
    username: string;
    comment: string;
    timePostted: string;
    _id: string;
    ranking: 0;
    nestedCommentsCount: 0;
  }[];
}
