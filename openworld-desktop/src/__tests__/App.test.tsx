/* eslint-env jest */
import React from "react";
import renderer from "react-test-renderer";
import Teach from "../renderer/views/teach";

test("renders app", () => {
  const tree = renderer.create(<Teach />).toJSON();
  expect(tree).toMatchSnapshot();
});
