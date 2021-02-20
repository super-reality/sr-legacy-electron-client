import React from "react";
import "./index.scss";
import { useSelector } from "react-redux";
import reduxAction from "../../redux/reduxAction";
import store, { AppState } from "../../redux/stores/renderer";
import Menu from "./support-menu";
import AskForHelp from "./support-help";
import GiveHelp from "./support-tickets";

export const MENU = 0;
export const ASK = 1;
export const SEARCH = 2;

export const chooseOption = (index: TSupportOptions) => {
  reduxAction(store.dispatch, {
    type: "SET_SUPPORT_TICKET",
    arg: {
      supportOption: index,
    },
  });
};

export const returnToMenu = () => {
  reduxAction(store.dispatch, {
    type: "SET_SUPPORT_TICKET",
    arg: {
      supportOption: MENU,
    },
  });
};

const options = [Menu, AskForHelp, GiveHelp];

export type TSupportOptions = typeof MENU | typeof ASK | typeof SEARCH;

export default function Support(): JSX.Element {
  /*   const slice = store.getState().createSupportTicket;
  const { supportOption } = slice; */
  const { supportOption } = useSelector(
    (state: AppState) => state.createSupportTicket
  );
  // eslint-disable-next-line
  const CurrentOption = options[supportOption];
  return <CurrentOption />;
}
