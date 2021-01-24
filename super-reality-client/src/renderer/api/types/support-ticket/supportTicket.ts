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


