import React, { /* useState, useCallback, */ useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "@reach/router";
import reduxAction from "../../../redux/reduxAction";
import { IData } from "../../../api/types/support-ticket/supportTicket";
import { AppState } from "../../../redux/stores/renderer";
/* import GettingStarted from "./getting-started";
import Help from "./help"; */
import getVibes from "./support-help-utils/getVibes";
import "./index.scss";
import getSingleCategory from "./support-help-utils/getSingleCategory";
import getAllCategories from "./support-help-utils/getAllCategories";

export const Category: IData[] = [
  { _id: "600ee83930404f258c70267b", name: "Blender" },
  { _id: "601428b7aa97791f0c660c35", name: "2D Pixel Art Animation" },
  { _id: "603917c51135c537364f2d85", name: "Mathematics" },
  { _id: "123123212312", name: "3D Animation" },
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

/* export interface SupportSectionsProps {
  goStart: () => void;
  goHelp: () => void;
} */

/* const START = 0;
const HELP = 1; */

/* type sections = typeof START | typeof HELP; */

/* const sections = [GettingStarted, Help]; */

/* eslint-disable @typescript-eslint/no-non-null-assertion */

interface ISupportHelpProps extends RouteComponentProps {
  children: React.ReactNode;
}

export default function Support(props: ISupportHelpProps): JSX.Element {
  console.log(props);
  const dispatch = useDispatch();
  const { children } = props;
  const {
    skillsData,
    categoryData /* 
    supportScreen, */,
    vibeData,
    category,
    newCategoryName,
  } = useSelector((state: AppState) => state.createSupportTicket);
  useEffect(() => {
    if (!skillsData.length && !categoryData.length) {
      (async () => {
        getAllCategories(3).then((categories) => {
          reduxAction(dispatch, {
            type: "SET_SUPPORT_TICKET",
            arg: {
              skillsData: Skills,
              categoryData: categories.reverse(),
            },
          });
        });
      })();
    }

    if (vibeData.positiveVibes.length == 0) {
      (async () => {
        await getVibes().then((result) => {
          reduxAction(dispatch, {
            type: "SET_SUPPORT_TICKET",
            arg: {
              vibeData: result,
            },
          });
        });
      })();
    }

    /*     return () => {
      reduxAction(dispatch, {
        type: "SUPPORT_TICKET_RESET",
        arg: null,
      });
    }; */
  }, []);

  useEffect(() => {
    if (newCategoryName == "") {
      (async () => {
        await getSingleCategory(category).then((cat) => {
          reduxAction(dispatch, {
            type: "SET_SUPPORT_TICKET",
            arg: {
              subcategories: cat.subcategories,
            },
          });
        });
      })();
    }
  }, [category]);

  /*   const ClickGotSart = () => {
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
  }; */

  /*   const CurrentSectionComponent = sections[supportScreen!]; */

  return <>{children}</>;
}
