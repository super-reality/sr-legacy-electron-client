import React from 'react';
import "./index.scss";
import Collapsible from "../../components/collapsible";
import LessonActive from '../../components/lesson-active';

export default function Learn(): JSX.Element {
  return (
    <div className="mid">
      <div className="lesson-title-container">
        <div className="lesson-icon" />
        <div>
          <div className="lesson-title">My Learning Track</div>
          <div className="lesson-subtitle">Rodney Dude</div>
        </div>
      </div>
      <Collapsible expanded={true} title="Active Lessons">
        <LessonActive />
        <LessonActive />
        <LessonActive />
      </Collapsible>
      <Collapsible expanded={true} title="Active Subjects">
      </Collapsible>
      <Collapsible expanded={true} title="Active Collections">
      </Collapsible>
    </div>
  );
}
