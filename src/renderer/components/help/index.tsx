import "./index.scss";
import { useCallback, useState } from "react";

import IconTitle from "../../../assets/svg/title.svg";
import IconDescription from "../../../assets/svg/description.svg";
import IconSkills from "../../../assets/svg/skills.svg";
import IconProfileSharing from "../../../assets/svg/profile-sharing.svg";
import IconReview from "../../../assets/svg/review.svg";
import IconCircleTick from "../../../assets/svg/circle-tick.svg";

import StepTitle from "./step-title";
import StepDescription from "./step-description";
import StepSkills from "./step-skills";
import StepProfileSharing from "./step-profile-sharing";
import StepReview from "./step-review";

export interface StepSectionProps {
  goBack: () => void;
  goNext: () => void;
}

const helpSections = [
  {
    title: "Title",
    icon: IconTitle,
    section: StepTitle,
  },
  {
    title: "Description",
    icon: IconDescription,
    section: StepDescription,
  },
  {
    title: "Skills",
    icon: IconSkills,
    section: StepSkills,
  },
  {
    title: "Profile Sharing",
    icon: IconProfileSharing,
    section: StepProfileSharing,
  },
  {
    title: "Review",
    icon: IconReview,
    section: StepReview,
  },
];

export default function Help(): JSX.Element {
  const [currentSection, setCurrentSection] = useState(0);

  const clickGoNext = useCallback(() => {
    setCurrentSection(currentSection + 1);
  }, [currentSection]);

  const clickGoBack = useCallback(() => {
    setCurrentSection(currentSection - 1);
  }, [currentSection]);

  const CurrentSectionComponent = helpSections[currentSection].section;

  return (
    <div className="help">
      <div className="help-list">
        <div className="title">New Request</div>
        <ul>
          {helpSections.map((section) => {
            return (
              <li
                className={currentSection ? "active" : ""}
                key={`section-${section.title}`}
              >
                <a>{section.title}</a>
                <img src={section.icon} />
                <div className="progress-step">
                  <img src={IconCircleTick} alt="" />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="help-steps">
        <CurrentSectionComponent goBack={clickGoBack} goNext={clickGoNext} />
      </div>
    </div>
  );
}
