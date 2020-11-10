import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import interact from "interactjs";
import "./index.scss";
import fs from "fs";
import { useSelector, useDispatch } from "react-redux";
import { Item } from "../../api/types/item/item";
import useTransparentFix from "../../hooks/useTransparentFix";
import store, { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";
import setTopMost from "../../../utils/setTopMost";
import setMaximize from "../../../utils/setMaximize";
import { ReactComponent as ButtonMinimize } from "../../../assets/svg/win-minimize.svg";
import { ReactComponent as ButtonMaximize } from "../../../assets/svg/win-maximize.svg";
import { ReactComponent as ButtonClose } from "../../../assets/svg/win-close.svg";

import setFocusable from "../../../utils/setFocusable";
import setResizable from "../../../utils/setResizable";
import Lesson from "./lessson";
import Recorder from "./recorder";
import minimizeWindow from "../../../utils/minimizeWindow";
import closeWindow from "../../../utils/closeWindow";
import toggleMaximize from "../../../utils/toggleMaximize";
import VideoNavigation from "./video-navigation";
import VideoPreview from "./video-preview";
import AnchorEdit from "./anchor-edit";
import AnchorTester from "./anchor-tester";
import LessonPlayer from "../lesson-player";
import { voidFunction } from "../../constants";
import useDebounce from "../../hooks/useDebounce";
import userDataPath from "../../../utils/userDataPath";
import { RecordingJson } from "./recorder/types";
import VideoStatus from "./video-status";
import VideoData from "./video-data";
import ButtonSimple from "../button-simple";

function setMocks() {
  reduxAction(store.dispatch, {
    type: "CREATE_LESSON_V2_DATA",
    arg: {
      lessons: [{ _id: "5f7e0b2bf658117398cb4aca", name: "Test Lesson" }],
    },
  });
}

const restrictMinSize =
  interact.modifiers &&
  interact.modifiers.restrictSize({
    min: { width: 100, height: 100 },
  });

function TopBar() {
  const onMinimize = useCallback(() => {
    minimizeWindow();
  }, []);

  const onMaximize = useCallback(() => {
    toggleMaximize();
  }, []);

  const onCLose = useCallback(() => {
    closeWindow();
  }, []);

  return (
    <div className="top-bar">
      <div className="name">Super Reality</div>
      <div className="buttons">
        <div className="minimize" onClick={onMinimize}>
          <ButtonMinimize style={{ margin: "auto" }} />
        </div>
        <div className="maximize" onClick={onMaximize}>
          <ButtonMaximize style={{ margin: "auto" }} />
        </div>
        <div className="close" onClick={onCLose}>
          <ButtonClose style={{ margin: "auto" }} />
        </div>
      </div>
    </div>
  );
}

export default function CreateLessonDetached(): JSX.Element {
  const resizeContainer = useRef<HTMLDivElement>(null);
  const resizeContainerAnchor = useRef<HTMLDivElement>(null);
  const { overlayTransparent } = useSelector((state: AppState) => state.render);
  const [fxTest, setFxTest] = useState(false);
  const [fxFrame, setFxFrame] = useState("../fx-orb/");

  const {
    currentAnchor,
    currentRecording,
    anchorTestView,
    stepPreview,
    itemPreview,
    videoNavigation,
    videoDuration,
    treeItems,
  } = useSelector((state: AppState) => state.createLessonV2);
  const [openRecorder, setOpenRecorder] = useState<boolean>(false);
  const dispatch = useDispatch();
  useTransparentFix(false);

  console.log("treeItems:", treeItems, "itemPreview", itemPreview);
  const itemTest: Item | null = useMemo(
    () => treeItems["5fa59476e5674429bcfde682"] || null,
    ["5fa59476e5674429bcfde682", treeItems]
  );

  const setVideoNavPos = useCallback(
    (n: readonly number[]) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { videoNavigation: [...n] },
      });
    },
    [dispatch]
  );

  const debouncer = useDebounce(500);

  const debounceVideoNav = useCallback(
    (n: readonly number[]) => {
      debouncer(() => setVideoNavPos([...n]));
      const el = document.getElementById("video-hidden") as HTMLVideoElement;
      if (el) el.currentTime = n[1] / 1000;
    },
    [debouncer]
  );

  useEffect(() => {
    setMocks();
    document.body.style.backgroundColor = "rgba(0, 0, 0, 0)";
  }, []);

  useEffect(() => {
    if (resizeContainer.current) {
      interact(resizeContainer.current)
        .resizable({
          edges: { left: false, right: true, bottom: false, top: false },
          modifiers: [restrictMinSize],
          inertia: true,
        } as any)
        .on("resizemove", (event) => {
          const { target } = event;
          target.style.width = `${event.rect.width - 4}px`;
        });

      return (): void => {
        if (resizeContainer.current) interact(resizeContainer.current).unset();
      };
    }
    return voidFunction;
  }, [overlayTransparent, resizeContainer]);

  const setTransparent = useCallback(() => {
    reduxAction(dispatch, { type: "SET_OVERLAY_TRANSPARENT", arg: true });
    setFocusable(false);
    setTopMost(true);
    setMaximize(true);
    setResizable(false);
  }, [dispatch]);

  const setSolid = useCallback(() => {
    reduxAction(dispatch, { type: "SET_OVERLAY_TRANSPARENT", arg: false });
    setFocusable(true);
    setTopMost(false);
    setMaximize(false);
    setResizable(true);
  }, [dispatch]);

  const createRecorder = useCallback(() => {
    setTransparent();
    setOpenRecorder(true);
  }, []);

  const videoNavDomain = useMemo(() => [0, Math.round(videoDuration * 1000)], [
    videoDuration,
  ]);

  useEffect(() => {
    const userData = userDataPath();
    let json: RecordingJson = {
      step_data: [],
    };
    if (currentRecording) {
      try {
        const file = fs
          .readFileSync(
            `${userData}/step/snapshots/${currentRecording}.webm.json`
          )
          .toString("utf8");
        json = JSON.parse(file);
      } catch (e) {
        console.error(e);
      }
    }
    reduxAction(dispatch, {
      type: "SET_RECORDING_DATA",
      arg: json,
    });
    reduxAction(dispatch, {
      type: "CLEAR_RECORDING_CV_DATA",
      arg: null,
    });
  }, [dispatch, currentRecording]);

  return overlayTransparent ? (
    <div className="transparent-container click-through">
      {openRecorder && (
        <Recorder
          onFinish={() => {
            setOpenRecorder(false);
            setSolid();
          }}
        />
      )}
      {anchorTestView && (
        <>
          <AnchorTester
            onFinish={() => {
              setSolid();
            }}
          />
        </>
      )}
      {fxTest && (
        <>
          <iframe
            style={{
              width: "600px",
              height: "600px",
            }}
            className="fx-iframe click-through"
            src={fxFrame}
          />
          <ButtonSimple
            onClick={() => {
              setSolid();
              setFxTest(false);
            }}
            width="200px"
            height="16px"
          >
            OK
          </ButtonSimple>
          <ButtonSimple
            onClick={() => {
              setFxFrame("../fx-wavy/");
            }}
            width="200px"
            height="16px"
          >
            Wave
          </ButtonSimple>
          <ButtonSimple
            onClick={() => {
              setFxFrame("../fx-confetti/");
            }}
            width="200px"
            height="16px"
          >
            Confetti
          </ButtonSimple>
          <ButtonSimple
            onClick={() => {
              setFxFrame("../fx-orb/");
            }}
            width="200px"
            height="16px"
          >
            Cool Effect
          </ButtonSimple>
        </>
      )}
      {(stepPreview || itemPreview) && <LessonPlayer onFinish={setSolid} />}
    </div>
  ) : (
    <div className="solid-container">
      <TopBar />
      <div className="main-container">
        <div className="edit">
          <div
            className="creator"
            style={{ width: "340px" }}
            ref={resizeContainer}
          >
            <Lesson
              createRecorder={createRecorder}
              setTransparent={setTransparent}
            />
          </div>
          {currentAnchor !== undefined ? (
            <div
              className="anchor-edit"
              style={{ width: "340px" }}
              ref={resizeContainerAnchor}
            >
              <AnchorEdit setTransparent={setTransparent} />
            </div>
          ) : (
            <></>
          )}
          <div className="preview">
            <VideoPreview />
          </div>
        </div>
        <div className="nav">
          <ButtonSimple
            onClick={() => {
              setTransparent();
              setFxTest(true);
            }}
            width="200px"
            height="16px"
          >
            FX TEST
          </ButtonSimple>
          <VideoStatus />
          <VideoNavigation
            domain={videoNavDomain}
            defaultValues={videoNavigation}
            ticksNumber={100}
            callback={debounceVideoNav}
            slideCallback={debounceVideoNav}
          />
          <VideoData />
        </div>
      </div>
    </div>
  );
}
/* eslint-disable dot-notation */
