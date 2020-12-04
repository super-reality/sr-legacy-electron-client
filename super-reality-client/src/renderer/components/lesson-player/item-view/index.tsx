import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import FindBox from "../find-box";
import ImageBox from "../image.box";
import { Item, ItemFocusTriggers } from "../../../api/types/item/item";
import { IAnchor } from "../../../api/types/anchor/anchor";
import DialogBox from "../dialog-box";
import FXBox from "../fx-box";
import { Rectangle } from "../../../../types/utils";

interface ItemViewProps {
  item: Item;
  anchorId: string;
  onSucess: (trigger: number | null) => void;
}

export default function ItemView(props: ItemViewProps) {
  const { anchorId, item, onSucess } = props;

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
    const newPos = {
      x: anchor && item.anchor ? cvResult.x + (item?.relativePos.x || 0) : 0,
      y: anchor && item.anchor ? cvResult.y + (item?.relativePos.y || 0) : 0,
      width: item?.relativePos.width || 400,
      height: item?.relativePos.height || 300,
    };
    setPos(newPos);

    const newStyle = !item.anchor
      ? {
          left: `calc((100% - ${item?.relativePos.width}px) / 100 * ${
            item?.relativePos.horizontal || 0
          })`,
          top: `calc((100% - ${item?.relativePos.height}px) / 100 * ${
            item?.relativePos.vertical || 0
          })`,
        }
      : {};
    setStyle(newStyle);

    if (
      cvResult.dist > 0 &&
      item &&
      anchor &&
      item.type == "focus_highlight" &&
      cvResult.dist < anchor.cvMatchValue / 100
    ) {
      onSucess(ItemFocusTriggers["Target found"]);
    }
  }, [anchor, cvResult, onSucess]);

  useEffect(() => {
    updatePos();
  }, [cvResult, updatePos]);

  if (previewing && item.anchor && cvResult.dist < anchor.cvMatchValue / 1000) {
    return <></>;
  }

  if (!pos) {
    return <></>;
  }

  return (
    <>
      {item && item.type == "focus_highlight" && (
        <FindBox
          clickThrough
          pos={pos}
          style={style}
          type={item.focus}
          callback={onSucess}
        />
      )}
      {item && item.type == "image" && (
        <ImageBox
          pos={pos}
          style={style}
          image={item.url}
          trigger={item.trigger}
          callback={onSucess}
        />
      )}
      {item && item.type == "dialog" && (
        <DialogBox
          pos={pos}
          style={style}
          text={item.text}
          trigger={item.trigger}
          callback={onSucess}
        />
      )}
      {item && item.type == "fx" && (
        <FXBox
          pos={pos}
          style={{ ...style, border: "none" }}
          effect={item.effect}
          callback={onSucess}
        />
      )}
    </>
  );
}
