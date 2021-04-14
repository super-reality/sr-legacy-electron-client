import { CSSProperties } from "react";
import Flex from "../flex";
import "../containers.scss";
import { AreaChangeEv } from "../../../types/utils";

interface BaseTextAreaProps {
  title: string;
  placeholder?: string;
  value: string;
  onChange: (event: AreaChangeEv) => void;
  style?: CSSProperties;
}

export default function BaseTextArea(props: BaseTextAreaProps): JSX.Element {
  const { title, placeholder, value, onChange, style } = props;

  return (
    <Flex style={style}>
      <div className="container-with-desc">
        <div>{title}</div>
        <textarea
          style={{ resize: "vertical", minHeight: "64px" }}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onChange}
        />
      </div>
    </Flex>
  );
}
