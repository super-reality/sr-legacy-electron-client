import React from "react";
import Flex from "../flex";
import "../containers.scss";
import { InputChangeEv } from "../../../types/utils";

interface BaseInputProps {
  title: string;
  placeholder?: string;
  value: string;
  onChange: (event: InputChangeEv) => void;
  autoFocus?: boolean;
}

export default function BaseInput(props: BaseInputProps): JSX.Element {
  const { title, placeholder, value, onChange, autoFocus } = props;

  return (
    <Flex>
      <div className="container-with-desc">
        <div>{title}</div>
        <input
          placeholder={placeholder || ""}
          ref={(input) => {
            if (autoFocus && input) input.focus();
          }}
          value={value}
          onChange={onChange}
          onKeyDown={onChange}
        />
      </div>
    </Flex>
  );
}
