import React, { CSSProperties } from "react";

import "./index.scss";
import {
  ItemInner,
  Icon,
  Title,
  Text,
  ContainerTop,
  ContainerFlex,
} from "../item-inner";
import { IStep } from "../../api/types/step/step";

interface StepProps {
  data: IStep;
  number: number;
  drag?: boolean;
  style?: CSSProperties;
}

export default function Step(props: StepProps): JSX.Element {
  const { data, drag, style, number } = props;

  return (
    <ItemInner
      style={{
        margin: "0",
        width: "-webkit-fill-available",
        height: "-webkit-fill-available",
        ...style,
      }}
      drag={drag}
      text
    >
      <ContainerFlex>
        <Title title={data.name} sub={`Step ${number}`} />
      </ContainerFlex>
      <ContainerFlex
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <Text>{data.description}</Text>
      </ContainerFlex>
    </ItemInner>
  );
}
