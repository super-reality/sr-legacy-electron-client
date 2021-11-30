import { CSSProperties } from "react";

import "./index.scss";
import { ItemInner, Title, Text } from "../item-inner";
import { IStep } from "../../api/types/step-old/step";

interface StepProps {
  data: IStep;
  number: number;
  onClick?: () => void;
  style?: CSSProperties;
}

export default function Step(props: StepProps): JSX.Element {
  const { data, onClick, style, number } = props;

  return (
    <ItemInner
      style={{
        margin: "8px",
        width: "-webkit-fill-available",
        ...style,
      }}
      onClick={onClick}
      text
    >
      <div className="container-step-edit">
        <Title title={data.name} sub={`Step ${number + 1}`} />
        <div />
        <div />
        <Text
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "pre",
          }}
        >
          {data.description}
        </Text>
      </div>
    </ItemInner>
  );
}
