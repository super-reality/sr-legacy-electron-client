import React from "react";
import { useSelector } from "react-redux";
import store, { AppState } from "../../../../redux/stores/renderer";
import { StepSectionProps } from "..";
import "./index.scss";

export default function StepReview(props: StepSectionProps): JSX.Element {
  const { goNext, goBack } = props;
  const slice = store.getState().createSupportTicket;

  const { title, category, skills, description, images } = useSelector(
    (state: AppState) => state.createSupportTicket
  );

  console.log(slice);
  console.log(skills);
  console.log(skills !== undefined);

  const getImages =
    images &&
    images.map((image) => (
      <li  key={image.path}>
        <div>
          <img src={image.path} alt="lol23" />
          <p>{image.name}</p>
        </div>
      </li>
    ));

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

      <div className="step fade">
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
          {images && images.length > 0 ? (
            <ul >{getImages}</ul>
          ) : (
            <p>No images selected</p>
          )}
        </div>

        <div className="review-step">
          <div className="step-title">Skills</div>
          <ul>{getSkills}</ul>
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
