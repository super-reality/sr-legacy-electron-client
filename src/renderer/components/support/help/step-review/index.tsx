import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/stores/renderer";
import { StepSectionProps, getNames, getSingleName } from "..";
import "./index.scss";
import ImagePreview from "../../../forms/DropFile/ImagePreview";
import postSupportTicket from "../../support-utils/postSupportTicket";
import { supportTicketPayload } from "../../../../api/types/support-ticket/supportTicket";

/* eslint-disable @typescript-eslint/no-non-null-assertion */

export default function StepReview(props: StepSectionProps): JSX.Element {
  const { goBack, index } = props;

  const {
    title,
    category,
    skills,
    description,
    images,
    skillsData,
    categoryData,
    supportType,
    newCategory,
    newCategoryName,
    newSkill,
    newSkillName,
  } = useSelector((state: AppState) => state.createSupportTicket);

  const getSkills =
    skills &&
    skillsData &&
    getNames(skills, skillsData).map((skill) => (
      <li className="review-skill" key={skill._id}>
        {skill.name}
      </li>
    ));

  const sendSupportTicket = (): void => {
    const skillArray: string[] = [...skills!];

    const i = skillArray.indexOf(newSkillName!);
    console.log(i);

    if (i !== -1) skillArray.splice(i, 1);

    let payload: supportTicketPayload = {
      title: title!,
      description: description!,
      supportType: supportType!,
      skills: skillArray!,
      supportCategory: category!,
      newCategory: newCategory!,
      newSkill: newSkill!,
    };

    if (newSkillName !== "" && newSkill) {
      payload = Object.assign(payload, { newSkillName: newSkillName });
    }

    if (newCategoryName !== "" && newCategory) {
      payload = Object.assign(payload, { newCategoryName: newCategoryName });
      delete payload.supportCategory;
    }

    console.log(payload);
    postSupportTicket(payload)
      .then((res: supportTicketPayload) => {
        console.log(res);
      })
      .catch((e: any) => console.log(e));
  };

  return (
    <div>
      <div className="title">Step {index} of 5</div>

      <div className="step">
        <div className="review-step">
          <div className="step-title">Title</div>
          <p>{title}</p>
          <span>Requested category</span>
          <p>
            {category && categoryData && getSingleName(category, categoryData)}
          </p>
        </div>

        <div className="review-step imageslist">
          <div className="step-title">Description</div>
          <p>{description}</p>
          <span>Images</span>
          {/* <ul>{getImages}</ul> */}
          {images && images.length > 0 ? (
            <ImagePreview values={images} removable="false" columns={3} />
          ) : (
            <p>No images selected</p>
          )}
        </div>

        <div className="review-step">
          <div className="step-title">Skills</div>
          <ul className="skills-list">{getSkills}</ul>
        </div>

        <div className="support-buttons">
          <button onClick={goBack} type="button">
            Back
          </button>
          <button onClick={sendSupportTicket} type="button">
            Ask for help
          </button>
        </div>
      </div>
    </div>
  );
}
