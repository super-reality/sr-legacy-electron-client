import "./index.scss";
import React, { useCallback, useState, useEffect } from "react";
import { animated, useSpring } from "react-spring";

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

  /*   const [currentSection, setCurrentSection] = useState(0); */

  const [index, setIndex] = useState(0);

  const [stateSpring, set] = useSpring(
    () =>
      ({
        transform: "translateX(0%)",
      } as any)
  );

  useEffect(() => {
    set({ transform: `translateX(-${33 * index}%)` });
  });

  const clickGoNext = useCallback(() => {
    setIndex(index + 1);
  }, [index]);

  const clickGoBack = useCallback(() => {
    setIndex(index - 1);
  }, [index]);

  /*   const CurrentSectionComponent = helpSections[currentSection].section; */

  return (
    <div className="support fade">
      <div className="support-list">
        <div className="title">New Request</div>
        <ul>
          {helpSections.map((section) => {
            return (
              <li key={`section-${section.title}`}>
                <a>{section.title}</a>
                <img src={section.icon} />
                <div className="progress-step">
                  <img src={IconCircleTick} alt="hola2" />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="support-steps">
        <animated.div style={stateSpring} className="support-scroll">
          <StepTitle index={index} goBack={goStart} goNext={clickGoNext} />
          <StepDescription
            index={index}
            goBack={clickGoBack}
            goNext={clickGoNext}
          />
          <StepSkills index={index} goBack={clickGoBack} goNext={clickGoNext} />
        </animated.div>
      </div>
    </div>
  );
}
