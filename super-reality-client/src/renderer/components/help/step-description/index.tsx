import React from "react";

export default function StepDescription(): JSX.Element {
  return (
    <>
      <div className="title">Step 2 of 5</div>
      <div className="step">
        <div className="step-title">Description</div>A good description of your
        request includes:
        <ul>
          <li>Need to learn a skill? Tell us what it is!</li>
          <li>
            Dont see a lesson you want to learn? We can create it for you!
          </li>
          <li>Need a gaming buddy? We will find you one!</li>
        </ul>
        <textarea />
        <p>Additional files ( optional )</p>
        <div className="upload-image">
          <label htmlFor="file">
            <span>drag or upload request images</span>.
          </label>
        </div>
        <div className="help-buttons">
          <button type="button">Back</button>
          <button type="button">Next</button>
        </div>
      </div>
    </>
  );
}
