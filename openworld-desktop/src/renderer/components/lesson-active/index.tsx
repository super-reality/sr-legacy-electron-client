import React from "react";
import "./index.scss";
import {ItemInner, Icon, Title, Social} from "../item-inner";

export default function LessonActive() {
  return (
    <ItemInner>
      <Icon />
      <Title title="Make a Sword" sub="Jhonny C" />
      <Social rating={4.7} share="http://someshareurl.com/1a3s2d" checked={true} />
    </ItemInner>
  );
}
