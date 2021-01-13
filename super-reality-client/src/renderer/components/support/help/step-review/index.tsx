import React from "react";
import { StepSectionProps } from "..";

export default function StepReview(props: StepSectionProps): JSX.Element {
  const { goNext, goBack } = props;

  return (
    <div>
      <div className="title">Step 1 of 5</div>

      <div className="step fade">
        <div className="step-title">Title</div>
        <span>Enter the name of your request</span>
        <input type="text" placeholder="I can't animate in Blender!" />

        <p>What can you request? Anything...we are here to help. </p>

        <ul>
          <li>Need to learn a skill? Tell us what it is!</li>
          <li>
            Dont see a lesson you want to learn? We can create it for you!
          </li>
          <li>Need a gaming buddy? We will find you one!</li>
        </ul>

        <div className="custom-checkbox">
          <input type="checkbox" />
          <span className="checkmark" />
          <label>Blender Animation</label>
        </div>

        <div className="custom-checkbox">
          <input type="checkbox" />
          <span className="checkmark" />
          <label>3D Animation</label>
        </div>

        <div className="custom-checkbox">
          <input type="checkbox" />
          <span className="checkmark" />
          <label>2D Pixel Art Animation</label>
        </div>

        <a className="see-more">See more options</a>

        <div className="support-buttons">
          <button onClick={goBack} type="button">
            Back
          </button>
          <button onClick={goNext} type="button">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
