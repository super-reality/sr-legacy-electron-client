import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Item } from "../../../items/item";
import { AppState } from "../../../redux/stores/renderer";

export default function useItem(itemId: string | undefined): Item | null {
  const { treeItems } = useSelector((state: AppState) => state.createLessonV2);

  const item = useMemo(() => {
    return treeItems[itemId || ""] || null;
  }, [treeItems, itemId]);

  return item;
}
