import React, { useState, useCallback, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import reduxAction from "../../redux/reduxAction";
import { IData } from "../../api/types/support-ticket/supportTicket";
import { AppState } from "../../redux/stores/renderer";
import GettingStarted from "./getting-started";
import Help from "./help";
import "./index.scss";

const Category: IData[] = [
  { id: "12313123123", name: "Blender Animation" },
  { id: "123123212312", name: "3D Animation" },
  { id: "1232312313123", name: "2D Pixel Art Animation" },
  { id: "123qweqeqqweeq", name: "Neuronal Networks" },
  { id: "123231sadasdasd", name: "Gaming" },
  { id: "123czxcczxccb23", name: "Programing" },
];

const Skills: IData[] = [
  { id: "3D Modeling", name: "3D Modeling" },
  { id: "Grease Pencil", name: "Grease Pencil" },
  { id: "Curve Editor", name: "Curve Editor" },
  { id: "idframe Animation", name: "idframe Animation" },
  { id: "Rendering", name: "Rendering" },
  { id: "Shaders", name: "Shaders" },
  { id: "Particles", name: "Particles" },
  { id: "Character", name: "Character" },
  { id: "Physics", name: "Physics" },
  { id: "Cars", name: "Cars" },
  { id: "Explosions", name: "Explosions" },
  { id: "Video Chat", name: "Video Chat" },
  { id: "Text", name: "Text" },
  { id: "Easy Going", name: "Easy Going" },
  { id: "Micromanages", name: "Micromanages" },
  { id: "Game Developer", name: "Game Developer" },
  { id: "Programmer", name: "Programmer" },
  { id: "Unity Coder", name: "Unity Coder" },
  { id: "Pixel Artist", name: "Pixel Artist" },
  { id: "Draw Cartoons", name: "Draw Cartoons" },
];

export interface SupportSectionsProps {
  goStart: () => void;
  goHelp: () => void;
}

const START = 0;
const HELP = 1;

type sections = typeof START | typeof HELP;

const sections = [GettingStarted, Help];

export default function Support(): JSX.Element {
  const [currentSection, setCurrentSection] = useState(START);
  const dispatch = useDispatch();
  const { skillsData, categoryData } = useSelector(
    (state: AppState) => state.createSupportTicket
  );
  useEffect(() => {
    reduxAction(dispatch, {
      type: "SET_SUPPORT_TICKET",
      arg: {
        skillsData: skillsData?.length == 0 ? Skills : skillsData,
        categoryData: categoryData?.length == 0 ? Category : categoryData,
      },
    });

    /*     return () => {
      reduxAction(dispatch, {
        type: "SUPPORT_TICKET_RESET",
        arg: null,
      });
    }; */
  }, []);

  const ClickGotSart = useCallback(() => {
    setCurrentSection(START);
  }, [currentSection]);

  const ClickGotHelp = useCallback(() => {
    setCurrentSection(HELP);
  }, [currentSection]);

  const CurrentSectionComponent = sections[currentSection];

  return (
    <>
      <CurrentSectionComponent goStart={ClickGotSart} goHelp={ClickGotHelp} />
    </>
  );
}
