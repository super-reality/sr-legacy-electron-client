import React from "react";
import "./index.scss";

export default function LessonActive(): JSX.Element {
  return <div className="lesson-container">
    <div className="lesson-icon" />
    <div className="lesson-title">
      <div className="lesson-name">Make a Sword</div>
      <div className="lesson-creator">Jonnhy C</div>
    </div>
    <div className="lesson-social">
      <div className="lesson-rating">4.7</div>
      <div className="lesson-share" />
      <div className="lesson-completed" />
    </div>
  </div>;
}
