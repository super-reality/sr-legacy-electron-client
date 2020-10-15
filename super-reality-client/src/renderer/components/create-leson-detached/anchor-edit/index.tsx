import React, { useCallback, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAnchor } from "../../../api/types/anchor/anchor";
import reduxAction from "../../../redux/reduxAction";
import { AppState } from "../../../redux/stores/renderer";
import BaseSlider from "../../base-slider";
import BaseToggle from "../../base-toggle";
import ButtonSimple from "../../button-simple";
import Flex from "../../flex";
import InsertMedia from "../../insert-media";
import updateAnchor from "../lesson-utils/updateAnchor";

import { ReactComponent as CloseButton } from "../../../../assets/svg/win-close.svg";

export default function AnchorEdit(): JSX.Element {
  const updateTImeout = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch();
  const { currentAnchor, treeAnchors } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const closeAnchorEdit = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: { currentAnchor: "" },
    });
  }, [dispatch]);

  const anchor = useMemo(() => {
    return treeAnchors[currentAnchor || ""] || null;
  }, [treeAnchors, currentAnchor]);

  const update = useCallback(
    (data: Partial<IAnchor>) => {
      const newData = { ...anchor, ...data };
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_SETANCHOR",
        arg: { anchor: newData },
      });
      // Debouce api update, 1 second (should make a debounce hook??)
      if (updateTImeout.current) clearTimeout(updateTImeout.current);
      updateTImeout.current = setTimeout(() => {
        updateAnchor(anchor, anchor._id);
      }, 1000);
    },
    [anchor, dispatch]
  );

  const setMatchValue = useCallback(
    (n: readonly number[]) => {
      update({ cvMatchValue: n[0] });
    },
    [update]
  );

  const setCanvasSize = useCallback(
    (n: readonly number[]) => {
      update({ cvCanvas: n[0] });
    },
    [update]
  );

  const setDelay = useCallback(
    (n: readonly number[]) => {
      update({ cvDelay: n[0] });
    },
    [update]
  );

  const setGrayscale = useCallback(
    (val: boolean) => {
      update({ cvGrayscale: val });
    },
    [update]
  );

  const setApplyThreshold = useCallback(
    (val: boolean) => {
      update({ cvApplyThreshold: val });
    },
    [update]
  );

  const setThreshold = useCallback(
    (n: readonly number[]) => {
      update({ cvThreshold: n[0] });
    },
    [update]
  );

  const insertCVImage = useCallback(
    (image: string, index: number) => {
      const imgArr = [...anchor.templates];
      imgArr.splice(index, 1, image);
      update({ templates: imgArr });
    },
    [anchor]
  );

  if (anchor === null) return <></>;
  const datekey = new Date().getTime();

  return (
    <div className="mid-tight" style={{ padding: "10px", marginTop: "0" }}>
      <Flex style={{ marginBottom: "16px" }}>
        <div>Edit Anchor</div>
        <div className="container-close" onClick={closeAnchorEdit}>
          <CloseButton style={{ margin: "auto" }} />
        </div>
      </Flex>
      <div className="container-with-desc">
        <div>Add CV Targets</div>
        <Flex style={{ flexDirection: "column" }}>
          {[...anchor.templates, undefined].map((image, i) => {
            return (
              <React.Fragment key={image || "cv-add"}>
                <InsertMedia
                  url
                  disk
                  snip
                  // eslint-disable-next-line react/no-array-index-key
                  key={`insert-media-${datekey}-${i}`}
                  imgUrl={image}
                  style={{
                    marginBottom: "8px",
                    width: "100%",
                  }}
                  callback={(str) => {
                    insertCVImage(str, i);
                  }}
                />
              </React.Fragment>
            );
          })}
        </Flex>
      </div>
      <BaseSlider
        title={`Match Value: ${anchor.cvMatchValue}`}
        domain={[800, 1000]}
        defaultValues={[anchor.cvMatchValue]}
        ticksNumber={10}
        callback={setMatchValue}
        slideCallback={setMatchValue}
      />
      <BaseSlider
        title={`Canvas Size: ${anchor.cvCanvas}% (${Math.round(
          (window.screen.width / 100) * anchor.cvCanvas
        )}px)`}
        domain={[10, 200]}
        defaultValues={[anchor.cvCanvas]}
        ticksNumber={8}
        step={10}
        callback={setCanvasSize}
        slideCallback={setCanvasSize}
      />
      <BaseToggle
        title="Grayscale"
        value={anchor.cvGrayscale}
        callback={setGrayscale}
      />
      <BaseToggle
        title="Apply Threshold"
        value={anchor.cvApplyThreshold}
        callback={setApplyThreshold}
      />
      <BaseSlider
        title={`Threshold: ${anchor.cvThreshold}`}
        domain={[0, 255]}
        defaultValues={[anchor.cvThreshold]}
        ticksNumber={10}
        callback={setThreshold}
        slideCallback={setThreshold}
      />
      <BaseSlider
        title={`Delay: ${anchor.cvDelay}ms`}
        domain={[1, 200]}
        defaultValues={[anchor.cvDelay]}
        ticksNumber={10}
        callback={setDelay}
        slideCallback={setDelay}
      />
    </div>
  );
}
