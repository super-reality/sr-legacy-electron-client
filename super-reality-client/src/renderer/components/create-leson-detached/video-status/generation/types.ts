import { Item } from "../../../../api/types/item/item";
import { IStep } from "../../../../api/types/step/step";

export interface GeneratedData {
  itemToStep: Record<string, string>;
  items: Record<string, Item>; // name to Item
  steps: Record<string, IStep>; // name to IStep
}
