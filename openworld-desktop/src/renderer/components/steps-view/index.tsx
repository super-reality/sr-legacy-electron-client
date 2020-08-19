import React, { useState, useEffect, useCallback } from "react";
import "./index.scss";
import "../create-lesson/index.scss";
import Flex from "../flex";
import { IStep } from "../../../types/api";
import InnerSearch from "../inner-search";
import Step from "../step";
import ReactSelect from "../select";
import useDraggableList from "../../hooks/useDraggableList";

interface StepsViewProps {
  steps: IStep[];
}

const sortOptions = ["Name", "Hghest Rated", "Duration"];

export default function StepsView(props: StepsViewProps): JSX.Element {
  const { steps } = props;
  const [sort, setSort] = useState(sortOptions[0]);

  const stepsList = steps.map((step) => {
    return <Step key={step.id} data={step} />;
  });

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
      <List className="steps-container" />
    </>
  );
}
