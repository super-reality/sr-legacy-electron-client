import React from "react";
import "./index.scss";
import "../create-lesson/index.scss";
import Flex from "../flex";
import { IStep } from "../../../types/teach";
import InnerSearch from "../inner-search";
import Step from "../step";

interface StepsViewProps {
  steps: IStep[];
}

export default function StepsView(props: StepsViewProps): JSX.Element {
  const { steps } = props;

  return (
    <div>
      <Flex>
        <InnerSearch />
      </Flex>
      <div className="steps-container">
        {
          steps.map(step => {
            return <Step key={step.id} data={step} />;
          })
        }
      </div>
    </div>
  );
}
