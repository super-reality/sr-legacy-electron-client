/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import swap from "lodash-move";
import Flex from "../flex";
import InnerSearch from "../inner-search";
import StepCreate from "../step-create";
import ReactSelect from "../select";
import useDraggableList from "../../hooks/useDraggableList";
import { AppState } from "../../redux/stores/renderer";
import reduxAction from "../../redux/reduxAction";
import { IStep } from "../../api/types/step/step";

const sortOptions = ["Name", "Hghest Rated", "Duration"];

export default function StepsView(): JSX.Element {
  const dispatch = useDispatch();
  const steps = useSelector((state: AppState) => state.createLesson.steps);
  const [sort, setSort] = useState(sortOptions[0]);

  // Memoize to avoid infinite re renders
  /*
  const stepsList = useMemo(
    () =>
      steps.map((step, i) => {
        return (
          <Step
            key={`step-view-${step.name}-${step.description}-${step.next}`}
            number={i}
            data={step as IStep}
          />
        );
      }),
    [steps]
  );
  */

  // Update the store when the list is reordered
  const onChange = useCallback(
    (swapA: number, swapB: number) => {
      const newSteps = swap(steps, swapA, swapB) as typeof steps;
      reduxAction(dispatch, {
        type: "CREATE_LESSON_DATA",
        arg: { steps: newSteps },
      });
    },
    [steps]
  );

  // To get the new order of the list we use the mutable ref object returned
  /*
  const [List, setItems, refs] = useDraggableList(stepsList, 90, onChange);

  // Force update the list when new items are added
  useEffect(() => {
    if (stepsList.length !== refs.current.length) {
      setItems(stepsList);
    }
  }, [stepsList, refs]);
  */

  return (
    <>
      <div className="mid">
        <Flex>
          <div>
            <InnerSearch onChange={() => {}} value="" />
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
      <div className="steps-container">
        {steps.map((step, i) => {
          return (
            <StepCreate
              key={`step-view-${step.name}-${step.description}-${step.next}`}
              number={i}
              data={step}
            />
          );
        })}
      </div>
    </>
  );
}
