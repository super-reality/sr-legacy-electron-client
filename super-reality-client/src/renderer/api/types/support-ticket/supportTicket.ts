export default interface supportTicker {
  supportType?: TsupportType;
  title?:string,
  category?:string,
  skills?: any[],
  description?: string,
  images?: File[],
}

export interface tags {
  name: string;
}
export type TsupportType = "help_short" | "help_long" | "build" | "question" | ""
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

interface skills {
  name: string;
  tags: tags[];
}
