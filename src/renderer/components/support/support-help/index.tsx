import React, { /* useState, useCallback, */ useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import reduxAction from "../../../redux/reduxAction";
import { IData } from "../../../api/types/support-ticket/supportTicket";
import { AppState } from "../../../redux/stores/renderer";
import GettingStarted from "./getting-started";
import Help from "./help";
import "./index.scss";

const Category: IData[] = [
  { _id: "12313123123", name: "Blender Animation" },
  { _id: "123123212312", name: "3D Animation" },
  { _id: "1232312313123", name: "2D Pixel Art Animation" },
  { _id: "123qweqeqqweeq", name: "Neuronal Networks" },
  { _id: "123231sadasdasd", name: "Gaming" },
  { _id: "123czxcczxccb23", name: "Programing" },
];

const Skills: IData[] = [
  { _id: "3D Modeling", name: "3D Modeling" },
  { _id: "Grease Pencil", name: "Grease Pencil" },
  { _id: "Curve Editor", name: "Curve Editor" },
  { _id: "idframe Animation", name: "idframe Animation" },
  { _id: "Rendering", name: "Rendering" },
  { _id: "Shaders", name: "Shaders" },
  { _id: "Particles", name: "Particles" },
  { _id: "Character", name: "Character" },
  { _id: "Physics", name: "Physics" },
  { _id: "Cars", name: "Cars" },
  { _id: "Explosions", name: "Explosions" },
  { _id: "Video Chat", name: "Video Chat" },
  { _id: "Text", name: "Text" },
  { _id: "Easy Going", name: "Easy Going" },
  { _id: "Micromanages", name: "Micromanages" },
  { _id: "Game Developer", name: "Game Developer" },
  { _id: "Programmer", name: "Programmer" },
  { _id: "Unity Coder", name: "Unity Coder" },
  { _id: "Pixel Artist", name: "Pixel Artist" },
  { _id: "Draw Cartoons", name: "Draw Cartoons" },
];

export interface SupportSectionsProps {
  goStart: () => void;
  goHelp: () => void;
}

const START = 0;
const HELP = 1;

type sections = typeof START | typeof HELP;

const sections = [GettingStarted, Help];

/* eslint-disable @typescript-eslint/no-non-null-assertion */

export default function Support(): JSX.Element {
  const dispatch = useDispatch();
  const { skillsData, categoryData, supportScreen } = useSelector(
    (state: AppState) => state.createSupportTicket
  );
  useEffect(() => {
    reduxAction(dispatch, {
      type: "SET_SUPPORT_TICKET",
      arg: {
        skillsData: skillsData && skillsData.length ? skillsData : Skills,
        categoryData:
          categoryData && categoryData.length ? categoryData : Category,
      },
    });

    /*     return () => {
      reduxAction(dispatch, {
        type: "SUPPORT_TICKET_RESET",
        arg: null,
      });
    }; */
  });

  const ClickGotSart = () => {
    reduxAction(dispatch, {
      type: "SET_SUPPORT_TICKET",
      arg: {
        supportScreen: START,
      },
    });
  };

  const ClickGotHelp = () => {
    reduxAction(dispatch, {
      type: "SET_SUPPORT_TICKET",
      arg: {
        supportScreen: HELP,
      },
    });
  };

  const CurrentSectionComponent = sections[supportScreen!];

  return (
    <>
      <CurrentSectionComponent goStart={ClickGotSart} goHelp={ClickGotHelp} />
    </>
  );
}
