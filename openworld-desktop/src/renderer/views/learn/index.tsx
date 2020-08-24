import React from "react";
import "./index.scss";
import "../../components/containers.scss";
import "../../components/buttons.scss";
import { useSelector } from "react-redux";
import Collapsible from "../../components/collapsible";
import LessonActive from "../../components/lesson-active";
import { AppState } from "../../redux/stores/renderer";
import Category from "../../../types/collections";
import { mockLessonData } from "../../../mocks";

export default function Learn(): JSX.Element {
  const topSelectStates = useSelector(
    (state: AppState) => state.render.topSelectStates
  );
  const current = topSelectStates.Learn;

  return (
    <>
      {current == Category.Lesson || current == Category.All ? (
        <Collapsible outer expanded title="Active Lessons">
          <LessonActive data={mockLessonData} />
          <LessonActive data={mockLessonData} />
          <LessonActive data={mockLessonData} />
        </Collapsible>
      ) : (
        <></>
      )}
    </>
  );
}
