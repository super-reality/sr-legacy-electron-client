import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import { Item } from "../../../items/item";
import { IAnchor } from "../../../api/types/anchor/anchor";
import { Rectangle } from "../../../../types/utils";
import getItemComponent from "../../../items/getItemComponent";
import { TriggerTypes } from "../../../items/endStep";

interface ItemViewProps {
  item: Item;
  anchorId: string;
  isOcr: boolean;
  onSucess: (trigger: TriggerTypes | null) => void;
}

export default function ItemView(props: ItemViewProps) {
  const { anchorId, isOcr, item, onSucess } = props;

  const { treeAnchors, previewing } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const { cvResult } = useSelector((state: AppState) => state.render);
  const [pos, setPos] = useState<Rectangle | null>(null);
  const [style, setStyle] = useState<CSSProperties>({});

  // Get item's anchor or just the one in use
  const anchor: IAnchor | undefined = useMemo(
    () => treeAnchors[anchorId] || undefined,
    [anchorId]
  );

  const updatePos = useCallback(() => {
    const cvFound =
      cvResult.dist > 0 &&
      item &&
      ((anchor && cvResult.dist < anchor.cvMatchValue / 100) ||
        (isOcr && cvResult.dist > 0.8));

    const newPos = {
      x:
        (anchor && item.anchor) || isOcr
          ? cvResult.x + (item.relativePos.x || 0)
          : 0,
      y:
        (anchor && item.anchor) || isOcr
          ? cvResult.y + (item.relativePos.y || 0)
          : 0,
      width: item.relativePos.width || 400,
      height: item.relativePos.height || 300,
    };

    const newStyle = !item.anchor
      ? {
          left: `calc((100% - ${item.relativePos.width}px) / 100 * ${
            item.relativePos.horizontal || 0
          })`,
          top: `calc((100% - ${item.relativePos.height}px) / 100 * ${
            item.relativePos.vertical || 0
          })`,
        }
      : {};

    if (
      item.type !== "focus_highlight" ||
      (cvFound && item.type == "focus_highlight")
    ) {
      setPos(newPos);
      setStyle(newStyle);
    }
  }, [anchor, cvResult, item, onSucess]);

  useEffect(() => {
    updatePos();
  }, [cvResult, updatePos]);

  if (
    item &&
    anchor &&
    previewing &&
    item.anchor &&
    cvResult.dist < anchor.cvMatchValue / 1000
  ) {
    return <></>;
  }

  if (!pos) {
    return <></>;
  }

  const ItemComponent = getItemComponent(item);

  return (
    <>
      {ItemComponent && (
        <ItemComponent
          clickThrough
          pos={pos}
          style={style}
          item={item}
          callback={onSucess}
        />
      )}
    </>
  );
}
