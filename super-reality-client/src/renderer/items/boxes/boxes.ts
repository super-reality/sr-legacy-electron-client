import { CSSProperties } from "react";
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
  callback?: (trigger: number) => void;
}
