/* eslint-disable camelcase */
import { CodeSuccess } from "..";

export default interface supportTicker {
  supportType?: TsupportType;
  title?: string;
  category?: string;
  skills?: string[];
  description?: string;
  images?: File[];
  newSkill?: boolean;
  newSkillName?: string;
  newCategory?: boolean;
  newCategoryName?: string;
  skillsData?: IData[];
  searchedSkills?: IData[];
  categoryData?: IData[];
  supportScreen?: TSupportScreen;
  vibes?: IVibe[];
}

const START = 0;
const HELP = 1;

type TSupportScreen = typeof START | typeof HELP;

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
  name: string;
  level: number;
}

export interface supportTicketsGet {
  err_code: CodeSuccess;
  tickets: supportTicketPayload[];
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
