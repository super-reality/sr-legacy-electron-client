/* eslint-disable camelcase */
import { CodeSuccess } from "..";

export default interface supportTicker {
  supportType: TsupportType;
  title: string;
  category: string;
  skills: string[];
  description: string;
  images?: File[];
  newSkill?: boolean;
  newSkillName?: string;
  newCategory?: boolean;
  newCategoryName?: string;
  skillsData: IData[];
  searchedSkills: IData[];
  categoryData: IData[];
  supportScreen: TSupportScreen;
  supportOption: TSupportOption;
  vibeData: IGetVibesObjectResult;
  vibes: IVibe[];
}

const START = 0;
const HELP = 1;

type TSupportScreen = typeof START | typeof HELP;

const MENU = 0;
const ASK = 1;
const SEARCH = 2;

type TSupportOption = typeof MENU | typeof ASK | typeof SEARCH;

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

export interface IFile {
  lastModified: number;
  name: string;
  path: string;
  size: number;
  type: string;
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

export interface supportTicketsGet {
  err_code: CodeSuccess;
  tickets: supportTicketPayload[];
}

export interface singleSupportTicketsGet {
  err_code: CodeSuccess;
  ticket: singleSupportTicketsPayload;
  category: {
    name: string;
    _id: string;
  };
  skill: { name: string; _id: string }[];
}

export interface supportTicketsSearch {
  err_code: CodeSuccess;
  tickets: supportTicketPayload[];
}

export interface ISearchSupportTickets {
  name?: string;
  category?: string;
  limit?: number;
}

export interface supportTicketPayloadGet {
  err_code: CodeSuccess;
  ticket: supportTicketPayload;
}

export interface IVibeRatings {
  vibes: IVibeRating[];
}

export interface IVibeRating {
  name: string;
  emoji: string;
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
export type TsupportType =
  | "help_short"
  | "help_long"
  | "build"
  | "question"
  | ""
  | undefined;
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
