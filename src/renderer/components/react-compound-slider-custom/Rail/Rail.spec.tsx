/* eslint-env jest */
/* eslint-disable import/no-extraneous-dependencies */
import { shallow } from "enzyme";
import { Rail } from "./Rail";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

describe("<Rail />", () => {
  it("renders the result of child function", () => {
    const wrapper = shallow(
      <Rail emitMouse={noop} emitTouch={noop}>
        {() => {
          return <div className="foo" />;
        }}
      </Rail>
    );

    expect(wrapper.contains(<div className="foo" />)).toBe(true);
  });
});
