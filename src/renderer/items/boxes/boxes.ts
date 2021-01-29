import { CSSProperties } from "react";
import { TriggerTypes } from "../endStep";
import { BaseItem } from "../item";

export interface BaseBoxProps<T extends BaseItem> {
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  style?: CSSProperties;
  item: T;
  clickThrough?: boolean;
  callback?: (trigger: TriggerTypes | null) => void;
}
