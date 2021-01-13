import "./index.scss";
import React, { useCallback, /* useState */ } from "react";
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
  const [stateSpring, set] = useSpring(
    () =>
      ({
        transform: "translateX(0%)",
      } as any)
  );

  const clickGoNext = useCallback(() => {
    set({ transform: "translateX(-50%)" });

  }, [stateSpring]);

  const clickGoBack = useCallback(() => {
    set({ transform: "translateX(-0%)" });
  }, [stateSpring]);

/*   const CurrentSectionComponent = helpSections[currentSection].section; */

  return (
    <div className="support fade">
      <div className="support-list">
        <div className="title">New Request</div>
        <ul>
          {helpSections.map((section) => {
            return (
              <li
                
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
      <div className="support-steps">
        <animated.div style={stateSpring} className="support-scroll">
          <StepTitle goBack={goStart} goNext={clickGoNext}/>
          <StepDescription goBack={clickGoBack} goNext={clickGoNext}/>
          <StepSkills goBack={clickGoBack} goNext={clickGoNext}/>
            
        </animated.div>
      </div>
    </div>
  );
}
