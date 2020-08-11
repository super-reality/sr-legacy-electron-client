import React from "react";

import "./index.scss";
import { IStep } from "../../../types/api";

interface StepProps {
  data: IStep;
}

export default function Step(props: StepProps): JSX.Element {
  const {data} = props;

  return (
    <div className="step-container">
      <div className="step-icon" style={{backgroundImage: `url(${data.avatarUrl})`}} />
      <div className="step-title">{data.name}</div>
      <div className="step-rating">{data.rating}</div>
    </div>
  );
}