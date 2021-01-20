import React from "react";
import { useSelector } from "react-redux";
import store, { AppState } from "../../../../redux/stores/renderer";
import { StepSectionProps } from "..";
import "./index.scss";
import ImagePreview from "../../../forms/DropFile/ImagePreview";

export default function StepReview(props: StepSectionProps): JSX.Element {
  const { goNext, goBack } = props;
  const slice = store.getState().createSupportTicket;

  const { title, category, skills, description, images } = useSelector(
    (state: AppState) => state.createSupportTicket
  );

  console.log(slice);
  console.log(skills);
  console.log(skills !== undefined);

  /*   const getImages =
    images &&
    images.map((image) => (
      <li key={image.path}>
        <div>
          <div>
            <img src={image.path} alt="lol23" />
          </div>
          <p>{image.name}</p>
        </div>
      </li>
    )); */

  const getSkills =
    skills &&
    skills.map((skill) => (
      <li className="review-skill" key={skill}>
        {skill}
      </li>
    ));
  return (
    <div>
      <div className="title">Step 1 of 5</div>

      <div className="step">
        <div className="review-step">
          <div className="step-title">Title</div>
          <p>{title}</p>
          <span>Requested category</span>
          <p>{category}</p>
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
