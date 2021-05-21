export type CollectiveAIType =
  | "software"
  | "people"
  | "public person"
  | "insitution"
  | "animal"
  | "plant"
  | "object";

export interface CollectiveAI {
  name: string;
  type: CollectiveAIType;
  personality: string[];
  skills: string[];
  goals: string[];
  paragraph: string;
  icon: string;
}
