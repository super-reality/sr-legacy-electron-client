import React, {useState} from "react";
import "./index.scss";
import "../create-lesson/index.scss";
import Flex from "../flex";
import {IStep} from "../../../types/teach";
import InnerSearch from "../inner-search";
import Step from "../step";
import ReactSelect from "../select";

interface StepsViewProps {
  steps: IStep[];
}

const sortOptions = ["Name", "Hghest Rated", "Duration"];

export default function StepsView(props: StepsViewProps): JSX.Element {
  const {steps} = props;
  const [sort, setSort] = useState(sortOptions[0]);

  return (
    <div>
      <Flex>
        <div>
          <InnerSearch />
        </div>
        <ReactSelect
          style={{width: "-webkit-fill-available", marginLeft: "8px"}}
          className="dark"
          options={sortOptions}
          current={sort}
          callback={setSort}
        />
      </Flex>
      <div className="steps-container">
        {steps.map((step) => {
          return <Step key={step.id} data={step} />;
        })}
      </div>
    </div>
  );
}
