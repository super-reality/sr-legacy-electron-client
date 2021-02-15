import React from "react";
import { StepSectionProps } from "..";
/* import VibeRating from "../../../forms/VibeRatings/VibeEmoji"; */
import VibeGroup from "../../../forms/VibeRatings";

export default function stepVibes(props: StepSectionProps): JSX.Element {
  const { goBack, goNext, index } = props;
  return (
    <div>
      <div className="title">Step {index} of 5</div>
      <div className="step">
        <div className="step-title">Vibes</div>
        What vibes are you feeling in the moment of the request? This will help
        you pair with a teacher who can also help you
        <VibeGroup />
        {/* <VibeRating/> */}
        <div className="support-buttons">
          <button onClick={goBack} type="button">
            Back
          </button>
          <button onClick={goNext} type="submit">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
