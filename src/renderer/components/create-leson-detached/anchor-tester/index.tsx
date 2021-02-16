import React, { useCallback, useEffect, useState } from "react";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import reduxAction from "../../../redux/reduxAction";
import { AppState } from "../../../redux/stores/renderer";
import Windowlet from "../../windowlet";
import Flex from "../../flex";
import AnchorEditSliders from "../anchor-edit-sliders";
import { IAnchor } from "../../../api/types/anchor/anchor";
import ipcSend from "../../../../utils/ipcSend";
import getArrrayAverage from "../../../../utils/getArrayAverage";
import updateAnchor from "../lesson-utils/updateAnchor";
import useDebounce from "../../../hooks/useDebounce";
import AnchorBox from "../../../items/boxes/anchor-box";
import useAnchor from "../hooks/useAnchor";

interface AnchorTesterProps {
  onFinish: () => void;
}

export default function AnchorTester(props: AnchorTesterProps): JSX.Element {
  const { onFinish } = props;
  const dispatch = useDispatch();
  const { currentAnchor } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const { cvResult } = useSelector((state: AppState) => state.render);

  const [threshold, setThreshold] = useState(0);
  const [times, setTimes] = useState([0]);
  const [previewPos, setPreviewPos] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>();

  const anchor = useAnchor(currentAnchor);

  useEffect(() => {
    console.log("cvResult", cvResult);
    setThreshold(Math.round(cvResult.dist * 1000));
    const newArr = times.slice(Math.max(times.length - 9, 0));
    setTimes([...newArr, cvResult.time]);
    setPreviewPos(cvResult);
  }, [cvResult]);

  const done = useCallback(() => {
    onFinish();
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: { anchorTestView: false },
    });
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (anchor) {
        console.log("AnchorTester cv trigger");
        ipcSend({
          method: "cv",
          arg: {
            ...anchor,
            anchorId: anchor._id,
            cvMatchValue: 0,
            cvTemplates: anchor.templates,
            cvTo: "renderer",
          },
          to: "background",
        });
      }
    }, anchor?.cvDelay);

    return () => clearInterval(interval);
  }, [anchor]);

  const debouncer = useDebounce(1000);

  const debounceUpdate = useCallback(
    (data: Partial<IAnchor>) => {
      if (anchor) {
        const newData = { ...anchor, ...data };
        reduxAction(dispatch, {
          type: "CREATE_LESSON_V2_SETANCHOR",
          arg: { anchor: newData },
        });
        debouncer(() => updateAnchor(newData, anchor._id));
      }
    },
    [anchor, dispatch, debouncer]
  );

  return (
    <>
      {previewPos && <AnchorBox clickThrough pos={previewPos} />}
      <Windowlet title="Super Reality" width={300} height={300} onClose={done}>
        <div className="anchor-tester-container">
          <Flex style={{ marginTop: "16px", justifyContent: "center" }}>
            <div className="anchor-tester-match">Match:</div>
            <div
              className="anchor-tester-match"
              style={{
                marginLeft: "4px",
                color: `var(--color-${
                  anchor && anchor.cvMatchValue > threshold ? "red" : "green"
                })`,
              }}
            >
              {threshold / 10}%
            </div>
            <div
              className="anchor-tester-match"
              style={{
                fontSize: "16px",
                margin: "auto 0px auto 8px",
                color: `var(--color-${
                  anchor && anchor.cvMatchValue > threshold ? "red" : "green"
                })`,
              }}
            >
              {Math.round(getArrrayAverage(times))}ms
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
            {anchor && (
              <AnchorEditSliders anchor={anchor} update={debounceUpdate} />
            )}
          </Flex>
        </div>
      </Windowlet>
    </>
  );
}
