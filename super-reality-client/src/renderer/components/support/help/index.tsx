import "./index.scss";
import React from "react";
import IconTitle from "../../../../assets/svg/title.svg";
import IconDescription from "../../../../assets/svg/description.svg";
import IconSkills from "../../../../assets/svg/skills.svg";
import IconProfileSharing from "../../../../assets/svg/profile-sharing.svg";
import IconReview from "../../../../assets/svg/review.svg";
import IconCircleTick from "../../../../assets/svg/circle-tick.svg";

import StepTitle from "./step-title";
import StepDescription from "./step-description";
import StepSkills from "./step-skills";
import StepProfileSharing from "./step-profile-sharing";
import StepReview from "./step-review";
import useFormSlider from "../../../hooks/useFormSlider";

import { SupportSectionsProps } from "..";

export interface StepSectionProps {
  goBack: () => void;
  goNext: () => void;
  index?: number;
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

export default function Help(props: SupportSectionsProps): JSX.Element {
  const { goStart } = props;

  const {
    FormSlider,
    index,
    setIndex,
    clickGoNext,
    clickGoBack,
  } = useFormSlider(4);

  return (
    <div className="support fade">
      <div className="support-list">
        <div className="title">New Request</div>
        <ul>
          {helpSections.map((section, i) => {
            return (
              <li
                className={index == i ? "step-selected" : ""}
                onClick={() => setIndex(i)}
                key={`section-${section.title}`}
              >
                <a>{section.title}</a>
                <img src={section.icon} />
                <div className="progress-step">
                  <img src={IconCircleTick} alt="ds" />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="support-steps">
        <FormSlider>
          <StepTitle index={index + 1} goBack={goStart} goNext={clickGoNext} />
          <StepDescription
            index={index + 1}
            goBack={clickGoBack}
            goNext={clickGoNext}
          />
          <StepSkills
            index={index + 1}
            goBack={clickGoBack}
            goNext={clickGoNext}
          />
          <StepProfileSharing goBack={clickGoBack} goNext={clickGoNext} />
        </FormSlider>
      </div>
    </div>
  );
}
