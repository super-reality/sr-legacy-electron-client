import React from "react";
import "./index.scss";
import "../../components/containers.scss";
import "../../components/buttons.scss";
import { useRouteMatch } from "react-router-dom";
import Collapsible from "../../components/collapsible";
import LessonActive from "../../components/lesson-active";
import Category from "../../../types/collections";
import { mockLessonData } from "../../../mocks";

export default function Learn(): JSX.Element {
  const catMatch = useRouteMatch<{
    any: string;
    category: string;
  }>("/learn/:category");
  const current = (catMatch?.params.category || Category.All) as Category;

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
