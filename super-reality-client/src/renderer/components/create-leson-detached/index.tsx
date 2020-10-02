/* eslint-disable dot-notation */
import React, { useCallback, useEffect, useRef, useState } from "react";
import interact from "interactjs";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import useTransparentFix from "../../hooks/useTransparentFix";
import store, { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";
import setTopMost from "../../../utils/setTopMost";
import setMaximize from "../../../utils/setMaximize";
import { ReactComponent as RecordIcon } from "../../../assets/svg/record.svg";
import setFocusable from "../../../utils/setFocusable";
import setResizable from "../../../utils/setResizable";
import Lesson from "./lessson";
import globalData from "../../globalData";
import ButtonRound from "../button-round";
import Recorder from "./recorder";

function setMocks() {
  const lesson = {
    _id: "string",
    name: "test",
    cost: 0,
    status: 1,
    description: "",
    entry: 2,
    skills: ["skill"],
    difficulty: 2,
    media: [],
    location: {},
    chapters: [
      { _id: "001", name: "Chapter One" },
      { _id: "002", name: "Chapter Two" },
    ],
    setupScreenshots: [],
    setupInstructions: "",
    setupFiles: [],
  };
  reduxAction(store.dispatch, { type: "CREATE_LESSON_V2_DATA", arg: lesson });
  globalData.chapters["001"] = {
    _id: "001",
    name: "Chapter One",
    steps: ["step01"],
  };
  globalData.chapters["002"] = {
    _id: "002",
    name: "Chapter Two",
    steps: ["step01"],
  };
  globalData.steps["step01"] = {
    _id: "step01",
    name: "Step one",
    items: ["item01", "item02"],
  };
  globalData.items["001"] = {
    _id: "001",
    type: "focus_highlight",
    anchor: "001",
    relativePos: {
      x: 0,
      y: 0,
    },
    trigger: 0,
    destination: "",
    transition: 0,
    focus: "Rectangle",
  };
  globalData.items["002"] = {
    _id: "002",
    type: "image",
    anchor: undefined,
    relativePos: {
      x: 0,
      y: 0,
    },
    trigger: 0,
    destination: "",
    transition: 0,
    url: "",
  };

  globalData.anchors["001"] = {
    _id: "001",
    name: "Anchor",
    type: "crop",
    templates: [],
    function: "or",
    cvMatchValue: 990,
    cvCanvas: 100,
    cvDelay: 100,
    cvGrayscale: true,
    cvApplyThreshold: false,
    cvThreshold: 0,
  };
}

const restrictMinSize =
  interact.modifiers &&
  interact.modifiers.restrictSize({
    min: { width: 100, height: 100 },
  });

function TopBar() {
  return (
    <div className="top-bar">
      <div className="name">Super Reality</div>
      <div className="buttons">
        <div className="minimize">_</div>
        <div className="maximize">O</div>
        <div className="close">X</div>
      </div>
    </div>
  );
}

export default function CreateLessonDetached(): JSX.Element {
  const resizeContainer = useRef<HTMLDivElement>(null);
  const { overlayTransparent } = useSelector((state: AppState) => state.render);
  const [openRecorder, setOpenRecorder] = useState<boolean>(false);
  const dispatch = useDispatch();
  useTransparentFix(false);

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
    return () => {};
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

  return overlayTransparent ? (
    <div className="transparent-container click-through">
      {openRecorder ? (
        <Recorder
          onFinish={() => {
            setOpenRecorder(false);
            setSolid();
          }}
        />
      ) : (
        <></>
      )}
    </div>
  ) : (
    <div className="solid-container">
      <TopBar />
      <div className="main-container">
        <div className="edit">
          <div
            className="creator"
            style={{ width: "400px" }}
            ref={resizeContainer}
          >
            <Lesson />
          </div>
          <div className="preview" />
        </div>
        <div className="nav">
          <ButtonRound
            width="64px"
            height="64px"
            svg={RecordIcon}
            onClick={createRecorder}
          />
        </div>
      </div>
    </div>
  );
}
