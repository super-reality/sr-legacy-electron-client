import React from "react";

import "./index.scss";
import { useDispatch } from "react-redux";
import { ItemInner, Icon, Title, Text, Points } from "../item-inner";
import Category from "../../../types/collections";
import reduxAction from "../../redux/reduxAction";

interface StepProps {
  data: {
    title: string;
    category: Category;
    created: number;
    image: string;
    cost: number;
    description: string;
  };
}

export default function CreateOption(props: StepProps): JSX.Element {
  const { data } = props;
  const dispatch = useDispatch();

  return (
    <ItemInner
      text
      onClick={() => {
        reduxAction(dispatch, {
          type: "SET_TOP_SELECT",
          arg: { selected: data.category, path: "Create" },
        });
      }}
    >
      <Icon url={data.image} />
      <Title title={data.title} sub={`${data.created} created`} />
      <Points points={data.cost} />
      <Text>{data.description}</Text>
    </ItemInner>
  );
}
