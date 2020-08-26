import React, { useCallback } from "react";

import "./index.scss";
import { useDispatch } from "react-redux";
import {
  ItemInner,
  Icon,
  Title,
  Text,
  Points,
  ContainerTop,
  ContainerFlex,
} from "../item-inner";
import reduxAction from "../../redux/reduxAction";
import { Option } from "../../views/create/components";

interface StepProps {
  hover?: boolean;
  data: Option;
}

export default function CreateOption(props: StepProps): JSX.Element {
  const { data, hover } = props;
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    reduxAction(dispatch, {
      type: "SET_TOP_SELECT",
      arg: { selected: data.category, path: "Create" },
    });
  }, [dispatch]);

  return (
    <ItemInner text onClick={hover ? onClick : undefined}>
      <ContainerTop>
        <Icon url={data.image} />
        <Title title={data.title} sub={`${data.created} created`} />
        <Points points={data.cost} />
      </ContainerTop>
      <ContainerFlex>
        <Text>{data.description}</Text>
      </ContainerFlex>
    </ItemInner>
  );
}
