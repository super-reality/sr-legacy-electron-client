import React from "react";
import "./index.scss";

import { ReactComponent as ThreeDots } from "../../../../assets/svg/three-dots.svg";

interface LessonPreviewProps {
  title: string;
}

export default function LessonPreview(props: LessonPreviewProps) {
  const { title } = props;

  return (
    <div className="lesson-preview">
      <div className="image" />
      <div className="title-container">
        <div className="title">{title}</div>
        <div className="options-button">
          <ThreeDots fill="var(--color-icon)" />
        </div>
      </div>
    </div>
  );
}
