import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CVResult } from "../../../../types/utils";
import useCVMatch from "../../../hooks/useCVMatch";
import reduxAction from "../../../redux/reduxAction";
import { AppState } from "../../../redux/stores/renderer";
import Windowlet from "../windowlet";

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

  const anchor = useMemo(() => {
    return treeAnchors[currentAnchor || ""] || null;
  }, [treeAnchors, currentAnchor]);

  const cvCallback = useCallback((res: CVResult) => {
    setThreshold(Math.round(res.dist * 1000));
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

  return (
    <>
      <CV />
      <Windowlet title="Super Reality" width={280} height={320} onClose={done}>
        <div>Match: </div>
        <div
          style={{
            color: `var(--color-${
              anchor.cvMatchValue > threshold ? "red" : "green"
            })`,
          }}
        >
          {threshold / 10}
        </div>
      </Windowlet>
    </>
  );
}
