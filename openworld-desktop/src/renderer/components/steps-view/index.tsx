/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./index.scss";
import "../create-lesson/index.scss";
import { useSelector } from "react-redux";
import Flex from "../flex";
import InnerSearch from "../inner-search";
import Step from "../step";
import ReactSelect from "../select";
import useDraggableList from "../../hooks/useDraggableList";
import { AppState } from "../../redux/stores/renderer";
import { InitialStepType } from "../../redux/slices/createLessonSlice";

const sortOptions = ["Name", "Hghest Rated", "Duration"];

export default function StepsView(): JSX.Element {
  const steps = useSelector((state: AppState) => state.createLesson.steps);
  const [sort, setSort] = useState(sortOptions[0]);

  const stepsList = useMemo(
    () =>
      steps.map((step, i) => {
        return (
          <Step
            key={`step-view-${i}`}
            number={i + 1}
            data={step as InitialStepType}
          />
        );
      }),
    [steps]
  );

  const onChange = useCallback((list) => {
    console.log(list);
  }, []);

  // To get the new order of the list we use the mutable ref object returned
  const [List] = useDraggableList(stepsList, 90, onChange);

  return (
    <>
      <div className="mid">
        <Flex>
          <div>
            <InnerSearch />
          </div>
          <ReactSelect
            style={{ width: "-webkit-fill-available", marginLeft: "8px" }}
            className="dark"
            options={sortOptions}
            current={sort}
            callback={setSort}
          />
        </Flex>
      </div>
      <List
        key={`steps-draggable-${steps.length}`}
        className="steps-container"
      />
    </>
  );
}
