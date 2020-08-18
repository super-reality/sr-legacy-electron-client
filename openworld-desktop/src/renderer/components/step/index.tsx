import React from "react";

import "./index.scss";
import { IStep } from "../../../types/api";
import { ItemInner, Icon, Title, Text } from "../item-inner";

interface StepProps {
  data: IStep;
}

export default function Step(props: StepProps): JSX.Element {
  const { data } = props;

  return (
    <ItemInner
      style={{
        width: "-webkit-fill-available",
      }}
      drag
      text
    >
      <Icon url={data.avatarUrl} />
      <Title title={data.name} sub={data.id} />
      <Text>{data.description}</Text>
    </ItemInner>
  );
}
