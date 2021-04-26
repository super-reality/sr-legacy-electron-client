import { ForwardRefExoticComponent, RefAttributes } from "react";
import { BaseBoxProps } from "./boxes/boxes";
import { BaseItem } from "./item";
import itemsDatabase from "./itemsDatabase";

type RefDivComponent<T extends BaseItem> = ForwardRefExoticComponent<
  BaseBoxProps<T> & RefAttributes<HTMLDivElement>
>;

export default function getItemComponent<T extends BaseItem>(
  item: T
): RefDivComponent<T> | undefined {
  let ItemComponent: RefDivComponent<T> | undefined;

  // We instantiate to any because TS does not like to do this
  if (item && itemsDatabase[item.type]) {
    ItemComponent = itemsDatabase[item.type].component as any;
  }

  return ItemComponent;
}
