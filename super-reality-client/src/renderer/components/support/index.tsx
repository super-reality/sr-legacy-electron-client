import React, { useState, useCallback } from "react";

import GettingStarted from "./getting-started";
import Help from "./help";

import "./index.scss";

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
