import React, { useState, useEffect } from "react";
import "./index.scss";
import { SKILLS_SHORT, SKILLS_LONG } from "..";
import clock from "../../../../../assets/svg/clock.svg";
import calendar from "../../../../../assets/svg/calendar.svg";

const SHORT = 0;
const LONG = 1;

type SkillsOption = typeof SHORT | typeof LONG;

export default function LearningSkill({ type, setType }: any): JSX.Element {
  const [selectedOption, setSelectedOption] = useState<SkillsOption>(
    type == SKILLS_SHORT ? SHORT : LONG
  );

  useEffect(() => {
    if (selectedOption == SHORT) {
      setType(SKILLS_SHORT);
    }
    if (selectedOption == LONG) {
      setType(SKILLS_LONG);
    }
  });
  return (
    <div className="start-options">
      <div
        onClick={() => setSelectedOption(SHORT)}
        className={`start-option ${selectedOption == SHORT && "selected"}`}
      >
        <div className="start-option-content">
          <div className="option-dot" />
          <img src={clock} />
          <div className="start-option-content-title">Short term problem</div>
          <div className="start-option-content-description">
            Less than 1 day
          </div>
        </div>
      </div>
      <div
        onClick={() => setSelectedOption(LONG)}
        className={`start-option ${selectedOption == LONG && "selected"}`}
      >
        <div className="start-option-content">
          <div className="option-dot" />
          <img src={calendar} />
          <div className="start-option-content-title">Long term problems</div>
          <div className="start-option-content-description">
            More than a day
          </div>
        </div>
      </div>
    </div>
  );
}
