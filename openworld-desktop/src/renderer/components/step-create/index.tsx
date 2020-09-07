import React, { CSSProperties, useCallback } from "react";
import _ from "lodash";

import "./index.scss";
import { useDispatch } from "react-redux";
import { ItemInner, Title, Text } from "../item-inner";
import { IStep } from "../../api/types/step/step";
import EditButton from "../edit-button";
import reduxAction from "../../redux/reduxAction";

interface StepProps {
  data: IStep;
  number: number;
  drag?: boolean;
  style?: CSSProperties;
}

export default function StepCreate(props: StepProps): JSX.Element {
  const { data, drag, style, number } = props;
  const dispatch = useDispatch();

  const doEdit = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_STEP_DATA",
      arg: {
        ..._.pick(
          data,
          "images",
          "functions",
          "name",
          "trigger",
          "description",
          "next"
        ),
        index: number,
      },
    });
  }, [dispatch]);

  return (
    <ItemInner
      style={{
        margin: "8px",
        width: "-webkit-fill-available",
        ...style,
      }}
      drag={drag}
      text
    >
      <div className="container-step-edit">
        <Title title={data.name} sub={`Step ${number + 1}`} />
        <div />
        <EditButton callback={doEdit} />
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
