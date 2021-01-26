import { CodeSuccess, ApiSucess } from "..";

export default interface supportTicker {
  supportType?: TsupportType;
  title?:string;
  category?:string;
  skills?: string[];
  description?: string;
  images?: File[];
  newSkills?:string[];
  newCategory?:string;
  skillsData?: IData[];
  searchedSkills?: IData[];
  categoryData?: IData[];
}

export interface IData {
  name: string;
  id: string;
  new?:boolean;
}

export interface IDataGet{
  name: string;
  _id: string;
}

export interface ISkillsGet{
  err_code: CodeSuccess;
  skill: IDataGet[];
}

export interface ICategoryGet{
  err_code: CodeSuccess;
  category: IData[];
}

export interface Ioptions {
  id:string;
  name:string;
}



export interface Icategory {
  name:string;
  id:string;
}


export interface tags {
  name: string;
}
export type TsupportType = "help_short" | "help_long" | "build" | "question" | "" | undefined
interface option {
  name: string;
  description: string;
}
interface category {
  name: String;
}

interface requestCategory {
  name: string;
  tags: tags[];
}


