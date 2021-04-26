import { useState, useEffect } from "react";
import "./index.scss";

import { SKILLS_SHORT, SKILLS_LONG } from "..";
import { ReactComponent as ClockIcon } from "../../../../../../assets/svg/clock.svg";
import { ReactComponent as CalendarIcon } from "../../../../../../assets/svg/calendar.svg";
import { TsupportType } from "../../../../../api/types/support-ticket/supportTicket";

const SHORT = 0;
const LONG = 1;

type SkillsOption = typeof SHORT | typeof LONG;

interface ILearningSkill {
  type: TsupportType;
  setType: (value: TsupportType) => void;
}

export default function LearningSkill({
  type,
  setType,
}: ILearningSkill): JSX.Element {
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
          <ClockIcon />
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
          <CalendarIcon />
          <div className="start-option-content-title">Long term problems</div>
          <div className="start-option-content-description">
            More than a day
          </div>
        </div>
      </div>
    </div>
  );
}
