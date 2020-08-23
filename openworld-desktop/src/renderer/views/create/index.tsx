import React from "react";
import "./index.scss";
import "../../components/containers.scss";
import { useSelector } from "react-redux";
import Category from "../../../types/collections";
import { AppState } from "../../redux/stores/renderer";
import CreateLesson from "../../components/create-lesson";
import CreateOption from "../../components/create-option";
import createOptions from "./components";

export default function Create(): JSX.Element {
  const topSelectStates = useSelector(
    (state: AppState) => state.render.topSelectStates
  );
  const current = topSelectStates.Create as Category;

  return (
    <>
      {current == Category.All ? (
        createOptions.map((option) => (
          <CreateOption hover key={option.title} data={option} />
        ))
      ) : (
        <></>
      )}
      {current == Category.Lesson ? <CreateLesson /> : <></>}
    </>
  );
}