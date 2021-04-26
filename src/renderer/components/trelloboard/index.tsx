import React, { 
  useEffect, 
  // useMemo,
   useRef } from "react";
import interact from "interactjs";
import "./index.scss";
// import fs from "fs";

import { 
  // useSelector, 
  useDispatch, useSelector } from "react-redux";
import useTransparentFix from "../../hooks/useTransparentFix";
import store, { 
  AppState
 } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";

import minimizeWindow from "../../../utils/electron/minimizeWindow";

import { voidFunction } from "../../constants";

import Windowlet from "../windowlet";
import { MODE_HOME } from "../../redux/slices/renderSlice";
import getPrimaryMonitor from "../../../utils/electron/getPrimaryMonitor";
import TopMenuBar from "../top-menu-bar";

// import EditorSidebar from "./editor-sidebar";


import {
  Header, 
  BoardMenu,
  Subheader,
  BoardContainer,
  // BoardColModal
} from './components/index';
import HomeBoard from "./components/HomeBoard/HomeBoard";
import AddBoardModal from "./components/Modals/AddBoardModal";

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

export default function TrelloBoard(): JSX.Element {

  const resizeContainer = useRef<HTMLDivElement>();

  const dispatch = useDispatch();
  
  const boardData = useSelector((state: AppState) => state.trello.boardData);

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
    return voidFunction;
  }, [resizeContainer]);


  const primarySize = getPrimaryMonitor().workArea;

  return (
    <Windowlet
      width={primarySize.width}
      height={primarySize.height}
      title="Super Reality - Trelloboard"
      topBarContent={<TopMenuBar />}
      onMinimize={minimizeWindow}
      onClose={() => {
        reduxAction(dispatch, {
          type: "SET_APP_MODE",
          arg: MODE_HOME,
        });
      }}
    >
      <div className="main-container">
        <div className="edit">
                  
          <div className="animate-gradient preview" >
            <Header />
            <BoardMenu />
            {
              boardData && (
                <Subheader />
              )
            }
            
            <HomeBoard/>
            {
              boardData && (
                <BoardContainer />
              )
            }
            
            <AddBoardModal />
            {/* <BoardColModal/> */}
          </div>
        </div>
        
      </div>
    </Windowlet>
  );
}
