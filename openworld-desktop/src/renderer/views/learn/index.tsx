/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import React from "react";
import "./index.scss";
import "../../components/containers.scss";
import "../../components/buttons.scss";
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import Collapsible from "../../components/collapsible";
import LessonActive from "../../components/lesson-active";
import Category from "../../../types/collections";
import ViewLesson from "../../components/view-lesson";
import { AppState } from "../../redux/stores/renderer";

export default function Learn(): JSX.Element {
  const userdata = useSelector((state: AppState) => state.userData);
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
            {userdata.lessons.map((id) => (
              <LessonActive key={id} id={id} />
            ))}
          </Collapsible>
        )
      ) : (
        <></>
      )}
    </>
  );
}
