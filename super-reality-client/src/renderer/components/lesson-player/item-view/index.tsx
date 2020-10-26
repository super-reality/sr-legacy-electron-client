import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import FindBox from "../find-box";
import ImageBox from "../image.box";
import { Item } from "../../../api/types/item/item";

interface ItemViewProps {
  item: Item;
  onSucess: () => void;
}

export default function ItemView(props: ItemViewProps) {
  const { item, onSucess } = props;

  const { treeItems, treeAnchors } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const { cvResult } = useSelector((state: AppState) => state.render);
  const [pos, setPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [style, setStyle] = useState<CSSProperties>({});

  // Get item's anchor or just the one in use
  const anchor = item.anchor ? treeAnchors[item.anchor] : undefined;

  const updatePos = useCallback(() => {
    const newPos = {
      x: anchor ? cvResult.x + (item?.relativePos.x || 0) : 0,
      y: anchor ? cvResult.y + (item?.relativePos.y || 0) : 0,
      width: item?.relativePos.width || 400,
      height: item?.relativePos.height || 300,
    };
    setPos(newPos);

    const newStyle = anchor
      ? {
          left: `calc((100% - ${
            item?.relativePos.width
          }px) / 100 * ${Math.round(item?.relativePos.horizontal || 0)})`,
          top: `calc((100% - ${
            item?.relativePos.height
          }px) / 100 * ${Math.round(item?.relativePos.vertical || 0)})`,
        }
      : {};
    setStyle(newStyle);
  }, [anchor, cvResult, item]);

  useEffect(() => {
    updatePos();
  }, [cvResult, updatePos]);

  return (
    <>
      {item && item.type == "focus_highlight" && (
        <FindBox pos={pos} style={style} type={item.focus} />
      )}
      {item && item.type == "image" && (
        <ImageBox pos={pos} style={style} image={item.url} />
      )}
    </>
  );
}
