export default interface supportTicker {
    category: category;
    option: option;
    title: string;
    requestCategory: requestCategory;
    description: string;
    file?: string;
    skills: skills;
}

export interface tags {
  name: string;
}

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
