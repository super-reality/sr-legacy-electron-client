import React from "react";
import "./index.scss";
import Collapsible from "../../components/collapsible";
import LessonActive from "../../components/lesson-active";
import {useSelector} from "react-redux";
import {AppState} from "../../redux/stores/renderer";
import {Category} from "../../../types/collections";
import { mockLessonData } from "../../../__mocks__/mocks";

export default function Learn(): JSX.Element {
  const topSelectStates = useSelector(
    (state: AppState) => state.render.topSelectStates
  );
  const current = topSelectStates["/learn"] || Category.All;

  return (
    <div className="mid">
      <div className="lesson-title-container">
        <div className="lesson-icon" />
        <div>
          <div className="lesson-title">My Learning Track</div>
          <div className="lesson-subtitle">Rodney Dude</div>
        </div>
      </div>
      {current == Category.Lesson || current == Category.All ? (
        <Collapsible expanded={true} title="Active Lessons">
          <LessonActive data={mockLessonData} />
          <LessonActive data={mockLessonData} />
          <LessonActive data={mockLessonData} />
        </Collapsible>
      ) : (
        <></>
      )}
    </div>
  );
}
