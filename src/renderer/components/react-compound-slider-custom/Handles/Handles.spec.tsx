/* eslint-env jest */
/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import { shallow } from "enzyme";
import { Handles } from "./Handles";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

describe("<Handles />", () => {
  it("renders the result of child function", () => {
    const wrapper = shallow(
      <Handles handles={[]} emitMouse={noop} emitTouch={noop}>
        {() => {
          return <div className="foo" />;
        }}
      </Handles>
    );

    expect(wrapper.contains(<div className="foo" />)).toBe(true);
  });
});
