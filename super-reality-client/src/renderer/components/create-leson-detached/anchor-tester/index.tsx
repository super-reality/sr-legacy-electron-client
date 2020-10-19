import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { CVResult } from "../../../../types/utils";
import useCVMatch from "../../../hooks/useCVMatch";
import reduxAction from "../../../redux/reduxAction";
import { AppState } from "../../../redux/stores/renderer";
import Windowlet from "../windowlet";
import Flex from "../../flex";
import AnchorEditSliders from "../anchor-edit-sliders";
import { IAnchor } from "../../../api/types/anchor/anchor";
import FindBox from "../find-box";

interface AnchorTesterProps {
  onFinish: () => void;
}

export default function AnchorTester(props: AnchorTesterProps): JSX.Element {
  const { onFinish } = props;
  const dispatch = useDispatch();
  const { currentAnchor, treeAnchors } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const [threshold, setThreshold] = useState(0);
  const [previewPos, setPreviewPos] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>();

  const anchor = useMemo(() => {
    return treeAnchors[currentAnchor || ""] || null;
  }, [treeAnchors, currentAnchor]);

  const cvCallback = useCallback((res: CVResult) => {
    setThreshold(Math.round(res.dist * 1000));
    setPreviewPos(res);
  }, []);

  const [CV, isCapturing, startCV, endCV] = useCVMatch(
    anchor.templates,
    cvCallback,
    { ...anchor, cvMatchValue: 0 }
  );

  const done = useCallback(() => {
    onFinish();
    endCV();
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: { anchorTestView: false },
    });
  }, [dispatch, endCV]);

  useEffect(() => {
    console.log("Start CV capture");
    startCV();
  }, []);

  const update = useCallback(
    (data: Partial<IAnchor>) => {
      const newData = { ...anchor, ...data };
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_SETANCHOR",
        arg: { anchor: newData },
      });
    },
    [anchor, dispatch]
  );

  return (
    <>
      <CV />
      {previewPos && <FindBox pos={previewPos} />}
      <Windowlet title="Super Reality" width={300} height={300} onClose={done}>
        <div className="anchor-tester-container">
          <Flex style={{ marginTop: "16px", justifyContent: "center" }}>
            <div className="anchor-tester-match">Match:</div>
            <div
              className="anchor-tester-match"
              style={{
                marginLeft: "4px",
                color: `var(--color-${
                  anchor.cvMatchValue > threshold ? "red" : "green"
                })`,
              }}
            >
              {threshold / 10}%
            </div>
          </Flex>
          <Flex
            column
            style={{
              maxWidth: "370px",
              display: "flex",
              margin: "auto",
              padding: "8px",
            }}
          >
            <AnchorEditSliders update={update} />
          </Flex>
        </div>
      </Windowlet>
    </>
  );
}
