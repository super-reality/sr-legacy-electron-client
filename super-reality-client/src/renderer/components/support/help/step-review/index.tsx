import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../../redux/stores/renderer";
import { StepSectionProps, getNames, getSingleName } from "..";
import "./index.scss";
import ImagePreview from "../../../forms/DropFile/ImagePreview";

export default function StepReview(props: StepSectionProps): JSX.Element {
  const { goNext, goBack, index } = props;

  const {
    title,
    category,
    skills,
    description,
    images,
    skillsData,
    categoryData,
  } = useSelector((state: AppState) => state.createSupportTicket);

  const getSkills =
    skills &&
    skillsData &&
    getNames(skills, skillsData).map((skill) => (
      <li className="review-skill" key={skill.id}>
        {skill.name}
      </li>
    ));

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
          <button onClick={goNext} type="button">
            Ask for help
          </button>
        </div>
      </div>
    </div>
  );
}
