import React from "react";
import "./index.scss";
import "../../components/containers.scss";
import { useSelector } from "react-redux";
import Category from "../../../types/collections";
import { AppState } from "../../redux/stores/renderer";
import CreateLesson from "../../components/create-lesson";

export default function Create(): JSX.Element {
  const topSelectStates = useSelector(
    (state: AppState) => state.render.topSelectStates
  );
  const current = topSelectStates.Create as Category;

  return <>{current == Category.Lesson ? <CreateLesson /> : <></>}</>;
}
