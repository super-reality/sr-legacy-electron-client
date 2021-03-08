import React from "react";
import "./index.scss";
import Menu from "./support-menu";
import AskForHelp from "./support-help";
import GiveHelp from "./support-tickets";
import { setSidebarWidth } from "../../../utils/setSidebarWidth";

export const MENU = 0;
export const ASK = 1;
export const SEARCH = 2;

export type TSupportOptions = typeof MENU | typeof ASK | typeof SEARCH;

export default function Support(): JSX.Element {
  const [option, setOption] = React.useState<TSupportOptions>(MENU);

  React.useEffect(() => {
    setSidebarWidth(700);
  }, []);

  const chooseOption = React.useCallback(
    (index: TSupportOptions) => {
      setOption(index);
    },
    [option]
  );
  return (
    <>
      {option === MENU && <Menu setSupportChoice={chooseOption} />}
      {option === ASK && <AskForHelp />}
      {option === SEARCH && <GiveHelp />}
    </>
  );
}
