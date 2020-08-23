import React from "react";
import Flex from "../flex";
import Select from "../select";
import "../containers.scss";

interface BaseSelectProps<T> {
  title: string;
  current: T;
  options: T[];
  optionFormatter?: ((option: string | T) => string | JSX.Element) | undefined;
  callback: (option: T) => void;
}

export default function BaseSelect<T>(props: BaseSelectProps<T>): JSX.Element {
  const { title, current, options, optionFormatter, callback } = props;

  return (
    <Flex>
      <div className="container-with-desc">
        <div>{title}</div>
        <Select<T>
          current={current}
          options={options}
          optionFormatter={optionFormatter}
          callback={callback}
        />
      </div>
    </Flex>
  );
}
