import React from "react";
import { StepSectionProps } from "..";

export default function StepSkills(props: StepSectionProps): JSX.Element {
  const { goNext, goBack, index } = props;

  return (
    <div>
      <div className="title">Step {index} of 5</div>
      <div className="step">
        <div className="step-title">Skills</div>
        What are skills and expertise area most important to in your request?
        This will help pair you with teacher.
        <div className="skill">
          Blender
          <div className="skillset">
            <button type="button">+ 3D Modeling</button>
            <button type="button">+ Grease Pencil</button>
            <button type="button">+ Curve Editor</button>
            <button type="button">+ Keyframe Animation</button>
            <button type="button">+ Rendering</button>
            <button type="button">+ Shaders</button>
            <button type="button">+ Particles</button>
          </div>
        </div>
        <div className="skill">
          Teaching Style
          <div className="skillset">
            <button type="button">+ Video Chat</button>
            <button type="button">+ Text</button>
            <button type="button">+ Easy Going</button>
            <button type="button">+ Micromanages</button>
          </div>
        </div>
        <div className="skill">
          3D Animation
          <div className="skillset">
            <button type="button">+ Character</button>
            <button type="button">+ Physics</button>
            <button type="button">+ Cars</button>
            <button type="button">+ Explosions</button>
          </div>
        </div>
        <div className="skill">
          What additional skills are important to accomplish this task?
          <div className="skillset">
            <button type="button">+ Game Developer</button>
            <button type="button">+ Programmer</button>
            <button type="button">+ Unity Coder</button>
            <button type="button">+ Pixel Artist</button>
          </div>
        </div>
        <div className="skill">
          Not what you are looking for?
          <select>
            <option>Search Skills</option>
          </select>
        </div>
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
