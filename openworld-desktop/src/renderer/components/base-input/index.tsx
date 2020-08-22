import React from "react";
import Flex from "../flex";
import "../containers.scss";
import { InputChangeEv } from "../../../types/utils";

interface BaseInputProps {
  title: string;
  placeholder?: string;
  value: string;
  onChange: (event: InputChangeEv) => void;
}

export default function BaseInput(props: BaseInputProps): JSX.Element {
  const { title, placeholder, value, onChange } = props;

  return (
    <Flex>
      <div className="container-with-desc">
        <div>{title}</div>
        <input
          placeholder={placeholder || ""}
          value={value}
          onChange={onChange}
          onKeyDown={onChange}
        />
      </div>
    </Flex>
  );
}
