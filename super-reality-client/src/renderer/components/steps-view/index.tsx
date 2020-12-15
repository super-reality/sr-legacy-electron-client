/* eslint-disable react/no-array-index-key */
import React, { useState } from "react";
import "./index.scss";
import { useSelector } from "react-redux";
import Flex from "../flex";
import InnerSearch from "../inner-search";
import StepCreate from "../step-create";
import ReactSelect from "../select";
import { AppState } from "../../redux/stores/renderer";
import { voidFunction } from "../../constants";

const sortOptions = ["Name", "Hghest Rated", "Duration"];

export default function StepsView(): JSX.Element {
  const steps = useSelector((state: AppState) => state.createLesson.steps);
  const [sort, setSort] = useState(sortOptions[0]);

  return (
    <>
      <div className="mid">
        <Flex>
          <div>
            <InnerSearch onChange={voidFunction} value="" />
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
