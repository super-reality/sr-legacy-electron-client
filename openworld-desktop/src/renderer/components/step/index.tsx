import React from "react";

import "./index.scss";
import { IStep } from "../../../types/teach";

interface StepProps {
  data: IStep;
}

export default function Step(props: StepProps): JSX.Element {
  const {data} = props;

  return (
    <div className="step-container">
      <div className="step-icon"></div>
      <div className="step-title">{data.title}</div>
      <div className="step-rating">{data.rating}</div>
    </div>
  );
}