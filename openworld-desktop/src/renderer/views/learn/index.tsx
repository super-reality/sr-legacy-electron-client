import React from "react";
import "./index.scss";
import "../../components/buttons.scss";
import { useSelector } from "react-redux";
import Collapsible from "../../components/collapsible";
import LessonActive from "../../components/lesson-active";
import { AppState } from "../../redux/stores/renderer";
import Category from "../../../types/collections";
import { mockLessonData } from "../../../__mocks__/mocks";

export default function Learn(): JSX.Element {
  const { name, avatarUrl } = useSelector((state: AppState) => state.auth);
  const topSelectStates = useSelector(
    (state: AppState) => state.render.topSelectStates
  );
  const current = topSelectStates["/learn"] || Category.All;

  return (
    <div className="mid">
      <div className="lesson-title-container">
        <div
          className="avatar-icon"
          style={{ backgroundImage: `url(${avatarUrl})` }}
        />
        <div>
          <div className="lesson-title">My Learning Track</div>
          <div className="lesson-subtitle">{name}</div>
        </div>
      </div>
      {current == Category.Lesson || current == Category.All ? (
        <Collapsible expanded title="Active Lessons">
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
