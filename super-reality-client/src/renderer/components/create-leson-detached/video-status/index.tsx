import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import fs from "fs";
import path from "path";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { nativeImage, remote } from "electron";
import { ReactComponent as AnchorIcon } from "../../../../assets/svg/anchor.svg";
import ButtonRound from "../../button-round";
import { AppState } from "../../../redux/stores/renderer";
import usePopup from "../../../hooks/usePopup";
import ModalList from "../modal-list";
import reduxAction from "../../../redux/reduxAction";
import ButtonSimple from "../../button-simple";
import doCvMatch from "../../../../utils/doCVMatch";
import timestampToTime from "../../../../utils/timestampToTime";
import usePopupImageSource from "../../../hooks/usePopupImageSource";
import newAnchor from "../lesson-utils/newAnchor";
import userDataPath from "../../../../utils/userDataPath";
import uploadFileToS3 from "../../../../utils/uploadFileToS3";
import newItem from "../lesson-utils/newItem";
import sha1 from "../../../../utils/sha1";

export default function VideoStatus() {
  const dispatch = useDispatch();
  const {
    recordingData,
    treeAnchors,
    treeItems,
    videoNavigation,
    recordingTempItems,
    currentStep,
    cropRecording,
    cropRecordingPos,
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
        const tempItemId = Object.keys(recordingTempItems)[matchFrame];
        const orig = recordingData.step_data[matchFrame];
        const tempItem = recordingTempItems[tempItemId];
        const timestamp = orig.time_stamp;
        const timestampTime = timestampToTime(timestamp);
        videoHidden.currentTime = timestampTime / 1000;
        timeoutRef.current = setTimeout(() => {
          doCvMatch(anchor.templates, videoHidden, anchor).then((arg) => {
            reduxAction(dispatch, {
              type: "SET_RECORDING_CV_DATA",
              arg: { index: Math.round(timestampTime / 100), value: arg.dist },
            });
            reduxAction(dispatch, {
              type: "CREATE_LESSON_V2_SETITEM",
              arg: {
                item: {
                  ...tempItem,
                  relativePos: {
                    ...(tempItem?.relativePos || {}),
                    // only for mouse point item:
                    x: orig.x_cordinate - arg.x - 64,
                    y: orig.y_cordinate - arg.y - 64,
                    width: 128,
                    height: 128,
                  },
                },
              },
            });
            if (timeoutRef.current) {
              setMatchFrame(matchFrame + 1);
            }
          });
        }, 200);
      } else {
        setMatchFrame(-1);
      }
    }
  }, [
    matchFrame,
    recordingData,
    timeoutRef,
    dispatch,
    recordingTempItems,
    anchor,
  ]);

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

  const generateItems = useCallback(() => {
    Object.keys(recordingTempItems).map((k) => {
      const item = recordingTempItems[k];
      const id = sha1(item.name);
      console.log(treeItems[item._id]);
      newItem(treeItems[item._id], currentStep);
      return item;
    });
  }, [dispatch, recordingTempItems, treeItems, currentStep]);

  const doNewAnchor = useCallback(
    (url) => {
      newAnchor({
        name: "New Anchor",
        type: "crop",
        templates: [url],
        anchorFunction: "or",
        cvMatchValue: 0,
        cvCanvas: 50,
        cvDelay: 100,
        cvGrayscale: true,
        cvApplyThreshold: false,
        cvThreshold: 127,
      });
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { cropRecording: false },
      });
    },
    [dispatch]
  );

  const callback = useCallback(
    (e) => {
      if (e.indexOf("http") == -1) {
        uploadFileToS3(e).then((url) => {
          doNewAnchor(url);
        });
      } else {
        doNewAnchor(e);
      }
    },
    [doNewAnchor]
  );

  const doSaveNewAnchor = useCallback(() => {
    const userData = userDataPath();
    const fileName = `${userData}/capture.png`;
    const output = `${userData}/crop.png`;

    const canvas = document.getElementById("preview-video-canvas") as
      | HTMLCanvasElement
      | undefined;
    if (canvas) {
      const url = canvas.toDataURL("image/jpg", 0.8);

      // remove Base64 stuff from the Image
      const base64Data = url.replace(/^data:image\/png;base64,/, "");
      fs.writeFile(fileName, base64Data, "base64", (err) => {
        const image = nativeImage.createFromPath(fileName).crop({
          x: cropRecordingPos.x,
          y: cropRecordingPos.y,
          width: cropRecordingPos.width,
          height: cropRecordingPos.height,
        });
        // console.log(image);
        fs.writeFile(output, image.toPNG(), {}, () => {
          const timestamped = path.join(
            userData,
            `${new Date().getTime()}.png`
          );
          fs.copyFile(output, timestamped, () => callback(timestamped));
        });
      });
    }
  }, [callback, cropRecordingPos]);

  const [Popup, doCreateAnchor] = usePopupImageSource(
    callback,
    true,
    true,
    true,
    true
  );

  return (
    <div className="video-status-container">
      {Popup}
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
      {!cropRecording && (
        <>
          <ButtonRound
            svg={AnchorIcon}
            width="28px"
            height="28px"
            style={{ margin: "auto 8px" }}
            onClick={doOpenAnchorPopup}
          />
          <ButtonSimple
            width="140px"
            height="12px"
            margin="auto 4px"
            onClick={doCreateAnchor}
          >
            Create new anchor
          </ButtonSimple>
        </>
      )}
      {cropRecording && (
        <ButtonSimple
          width="140px"
          height="12px"
          margin="auto auto"
          onClick={doSaveNewAnchor}
        >
          Save anchor
        </ButtonSimple>
      )}
      {anchor && !cropRecording ? (
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
            onClick={generateItems}
          >
            Generate items
          </ButtonSimple>
        </>
      ) : (
        <div style={{ color: "var(--color-red)" }}>
          <i>{!cropRecording && "Attach an anchor to edit"}</i>
        </div>
      )}
      <canvas style={{ display: "none", width: "300px" }} id="canvasOutput" />
    </div>
  );
}
