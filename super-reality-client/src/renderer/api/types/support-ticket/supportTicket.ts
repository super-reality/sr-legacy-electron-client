export default interface supportTicker {
  supportType?: supportType;
  title?:string,
  category?:string,
  skills?: any[],
  description?: string,
  images?: File[],
}

export interface tags {
  name: string;
}
type supportType = "help_short" | "help_long" | "build" | "question"
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
