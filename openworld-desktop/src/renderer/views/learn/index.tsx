/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React from "react";
import "./index.scss";
import "../../components/containers.scss";
import "../../components/buttons.scss";
import { useRouteMatch } from "react-router-dom";
import Collapsible from "../../components/collapsible";
import LessonActive from "../../components/lesson-active";
import Category from "../../../types/collections";
import { mockLessonData } from "../../../mocks";
import ViewLesson from "../../components/view-lesson";

export default function Learn(): JSX.Element {
  const catMatch = useRouteMatch<{
    category: string;
  }>({ path: "/learn/:category" });

  const innerMatch = useRouteMatch<{
    category: string;
    match: string;
  }>({ path: "/learn/:category/:match" });

  const current = parseInt(
    catMatch?.params.category || innerMatch?.params.category || "0"
  ) as Category;

  const openIndividual = innerMatch?.params.match;

  return (
    <>
      {current == Category.Lesson || current == Category.All ? (
        openIndividual ? (
          <ViewLesson id={openIndividual} />
        ) : (
          <Collapsible outer expanded title="Active Lessons">
            <LessonActive data={mockLessonData} />
          </Collapsible>
        )
      ) : (
        <></>
      )}
    </>
  );
}
