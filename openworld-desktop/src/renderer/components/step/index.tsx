import React from "react";

import "./index.scss";
import { ItemInner, Icon, Title, Text } from "../item-inner";
import { IStep } from "../../api/types/step/step";

interface StepProps {
  data: IStep;
  number: number;
}

export default function Step(props: StepProps): JSX.Element {
  const { data, number } = props;

  return (
    <ItemInner
      style={{
        margin: "0",
        width: "-webkit-fill-available",
        height: "-webkit-fill-available",
      }}
      drag
      text
    >
      <Icon url={data.icon} />
      <Title title={data.name} sub={`Step ${number}`} />
      <Text>{data.description}</Text>
    </ItemInner>
  );
}
