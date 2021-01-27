import "./index.scss";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../redux/stores/renderer";

import IconTitle from "../../../../assets/svg/title.svg";
import IconDescription from "../../../../assets/svg/description.svg";
import IconSkills from "../../../../assets/svg/skills.svg";
/* import IconProfileSharing from "../../../../assets/svg/profile-sharing.svg"; */
import IconReview from "../../../../assets/svg/review.svg";
import IconCircleTick from "../../../../assets/svg/circle-tick.svg";

import StepTitle from "./step-title";
import StepDescription from "./step-description";
import StepSkills from "./step-skills";
/* import StepProfileSharing from "./step-profile-sharing"; */
import StepReview from "./step-review";
import useFormSlider from "../../../hooks/useFormSlider";
import { IData } from "../../../api/types/support-ticket/supportTicket";
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
  } /* 
  {
    title: "Profile Sharing",
    icon: IconProfileSharing,
    section: StepProfileSharing,
  }, */,
  {
    title: "Review",
    icon: IconReview,
    section: StepReview,
  },
];

export const getNames = (array: string[], arrayData: IData[]): IData[] => {
  const resultArray: IData[] = [];
  array.forEach((el) => {
    const i = arrayData.map((ele) => ele._id).indexOf(el);
    if (i !== -1) resultArray.push(arrayData[i]);
  });

  return resultArray;
};

export const getSingleName = (name: string, array: IData[]): string => {
  const i = array.map((el) => el._id).indexOf(name);
  if (i !== -1) return array[i].name;
  return name;
};

export default function Help(props: SupportSectionsProps): JSX.Element {
  const { goStart } = props;
  const { title, category, skills, description } = useSelector(
    (state: AppState) => state.createSupportTicket
  );
  const {
    FormSlider,
    index /* ,
    setIndex, */,
    clickGoNext,
    clickGoBack,
  } = useFormSlider(4);

  const verifyFill = (i: number) => {
    switch (i) {
      case 0:
        if (title !== "" && category !== "") return true;
        break;
      case 1:
        if (description !== "") return true;
        break;
      case 2:
        if (skills && skills.length > 0) return true;
        break;
      default:
        return false;
    }
    return false;
  };
  return (
    <div className="support fade">
      <div className="support-list">
        <div className="title">New Request</div>
        <ul>
          {helpSections.map((section, i) => {
            return (
              <li
                className={verifyFill(i) ? "step-selected" : ""}
                /* onClick={() => {
                  if (verifyFill(i)) setIndex(i);
                }} */
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
          {/* <StepProfileSharing goBack={clickGoBack} goNext={clickGoNext} /> */}
          <StepReview
            index={index + 1}
            goBack={clickGoBack}
            goNext={clickGoNext}
          />
        </FormSlider>
      </div>
    </div>
  );
}
