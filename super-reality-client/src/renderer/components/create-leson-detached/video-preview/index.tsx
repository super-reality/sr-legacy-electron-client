import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useMeasure } from "react-use";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";
import "./index.scss";
import ItemPreview from "../../lesson-player/item-preview";
import reduxAction from "../../../redux/reduxAction";
import getImage from "../../../../utils/getImage";

export default function VideoPreview(): JSX.Element {
  const { currentRecording, currentItem, treeAnchors, treeItems } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const dispatch = useDispatch();
  const horPor = useRef<HTMLDivElement>(null);
  const vertPos = useRef<HTMLDivElement>(null);
  const anchorImageRef = useRef<HTMLImageElement>(null);

  const [containerRef, { width, height }] = useMeasure<HTMLDivElement>();

  const item = useMemo(
    () => (currentItem ? treeItems[currentItem] : undefined),
    [currentItem, treeItems]
  );

  useEffect(() => {
    if (item?.anchor && anchorImageRef.current) {
      const anchor = treeAnchors[item?.anchor];
      [anchorImageRef.current.src] = anchor?.templates || "";
      reduxAction(dispatch, {
        type: "SET_CV_RESULT",
        arg: {
          id: anchor._id,
          width: anchorImageRef.current.width,
          height: anchorImageRef.current.height,
          x: width / 2 - anchorImageRef.current.width / 2,
          y: height / 2 - anchorImageRef.current.height / 2,
          sizeFactor: 1,
          dist: 0,
          time: 0,
        },
      });
    }
  }, [dispatch, treeAnchors, item, width, height]);

  return (
    <div ref={containerRef} className="video-preview-container">
      {!currentRecording && (
        <div className="video-preview-no-video">
          Select a recording to preview
        </div>
      )}
      <div
        key={`hor-${item?._id}` || ""}
        ref={horPor}
        className="horizontal-pos"
      />
      <div
        key={`ver-${item?._id}` || ""}
        ref={vertPos}
        className="vertical-pos"
      />
      <img ref={anchorImageRef} style={{ display: "none" }} />
      {item && <ItemPreview />}
    </div>
  );
}
