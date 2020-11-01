import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as AnchorIcon } from "../../../../assets/svg/anchor.svg";
import ButtonRound from "../../button-round";
import { AppState } from "../../../redux/stores/renderer";
import usePopup from "../../../hooks/usePopup";
import ModalList from "../modal-list";
import reduxAction from "../../../redux/reduxAction";
import ButtonSimple from "../../button-simple";
import doCvMatch from "../../../../utils/doCVMatch";
import timestampToTime from "../../../../utils/timestampToTime";

export default function VideoStatus() {
  const dispatch = useDispatch();
  const {
    recordingData,
    treeAnchors,
    videoNavigation,
    videoDuration,
  } = useSelector((state: AppState) => state.createLessonV2);
  const [matchFrame, setMatchFrame] = useState(-1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const anchor = useMemo(() => {
    return treeAnchors[recordingData.anchor || ""] || null;
  }, [treeAnchors, recordingData]);

  const [SelectAnchorPopup, doOpenAnchorPopup, close] = usePopup(false);

  const openAnchor = useCallback(
    (e) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { currentAnchor: e },
      });
    },
    [dispatch]
  );

  const setRecordingAnchor = useCallback(
    (e) => {
      reduxAction(dispatch, {
        type: "SET_RECORDING_DATA",
        arg: { anchor: e },
      });
    },
    [dispatch]
  );

  useEffect(() => {
    const videoHidden = document.getElementById(
      "video-hidden"
    ) as HTMLVideoElement;
    if (videoHidden && anchor) {
      doCvMatch(anchor.templates, videoHidden, anchor).then((arg) =>
        reduxAction(dispatch, { type: "SET_CV_RESULT", arg })
      );
    }
  }, [dispatch, anchor, videoNavigation]);

  // Anchor full video wide matching/testing
  useEffect(() => {
    const videoHidden = document.getElementById(
      "video-hidden"
    ) as HTMLVideoElement;
    if (videoHidden && anchor) {
      if (matchFrame !== -1 && matchFrame < recordingData.step_data.length) {
        const timestamp = recordingData.step_data[matchFrame].time_stamp;
        const timestampTime = timestampToTime(timestamp);
        videoHidden.currentTime = timestampTime / 1000;
        timeoutRef.current = setTimeout(() => {
          doCvMatch(anchor.templates, videoHidden, anchor).then((arg) => {
            reduxAction(dispatch, {
              type: "SET_RECORDING_CV_DATA",
              arg: { index: Math.round(timestampTime / 100), value: arg.dist },
            });
            if (timeoutRef.current) {
              setMatchFrame(matchFrame + 1);
            }
          });
        }, 50);
      } else {
        setMatchFrame(-1);
      }
    }
  }, [matchFrame, recordingData, timeoutRef, dispatch, anchor]);

  const testFullVideo = useCallback(() => {
    reduxAction(dispatch, {
      type: "CLEAR_RECORDING_CV_DATA",
      arg: null,
    });
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: { recordingCvFrame: 0, recordingCvMatchValue: anchor.cvMatchValue },
    });
    const videoHidden = document.getElementById(
      "video-hidden"
    ) as HTMLVideoElement;
    if (videoHidden && anchor) {
      videoHidden.currentTime = 0;
      setMatchFrame(0);
    }
  }, [anchor]);

  return (
    <div className="video-status-container">
      <SelectAnchorPopup
        width="320px"
        height="400px"
        style={{ padding: "10px" }}
      >
        <ModalList
          options={Object.keys(treeAnchors).map((a) => treeAnchors[a])}
          current={recordingData.anchor || ""}
          selected={recordingData.anchor || ""}
          setCurrent={(id) => {
            setRecordingAnchor(id);
            openAnchor(id);
            close();
          }}
          open={(id) => {
            openAnchor(id);
            close();
          }}
        />
      </SelectAnchorPopup>
      <ButtonRound
        svg={AnchorIcon}
        width="28px"
        height="28px"
        style={{ margin: "auto 8px" }}
        onClick={doOpenAnchorPopup}
      />
      {anchor ? (
        <>
          <ButtonSimple
            width="140px"
            height="12px"
            margin="auto 4px"
            onClick={() => openAnchor(anchor._id)}
          >
            {anchor.name}
          </ButtonSimple>
          <ButtonSimple
            width="140px"
            height="12px"
            margin="auto 4px"
            onClick={
              matchFrame == -1
                ? testFullVideo
                : () => {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    setMatchFrame(-1);
                  }
            }
          >
            {matchFrame == -1 ? "Check anchor" : "Stop checking"}
          </ButtonSimple>
          <ButtonSimple
            width="140px"
            height="12px"
            margin="auto 4px"
            onClick={() => {}}
          >
            Generate items
          </ButtonSimple>
        </>
      ) : (
        <div style={{ color: "var(--color-red)" }}>
          <i>Attach an anchor to edit</i>
        </div>
      )}
      <canvas style={{ display: "none", width: "300px" }} id="canvasOutput" />
    </div>
  );
}
