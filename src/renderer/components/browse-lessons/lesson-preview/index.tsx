import React from "react";
import "./index.scss";

import { ReactComponent as ThreeDots } from "../../../../assets/svg/three-dots.svg";

interface LessonPreviewProps {
  title: string;
  onClick: () => void;
}

export default function LessonPreview(props: LessonPreviewProps) {
  const { title, onClick } = props;

  return (
    <div className="lesson-preview" onClick={onClick}>
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

interface LessonPreviewAdd {
  onClick: () => void;
}

export function LessonPreviewAdd(props: LessonPreviewAdd) {
  const { onClick } = props;

  return (
    <div className="lesson-preview" onClick={onClick}>
      <div className="image-add" />
      <div className="title-container">
        <div className="title">Create New</div>
      </div>
    </div>
  );
}
