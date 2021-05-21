import { useState, useEffect } from "react";
import "./index.scss";
import { ReactComponent as SearchIcon } from "../../../assets/svg/search.svg";
import { InputChangeEv } from "../../../types/utils";

interface InnerSearchProps {
  onChange: (e: InputChangeEv, set?: (value: string) => void) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string;
}

export default function InnerSearch(props: InnerSearchProps): JSX.Element {
  const { value, onChange, onKeyUp } = props;
  const [current, setCurrent] = useState(value);

  useEffect(() => setCurrent(value), [value]);

  return (
    <div className="inner-search-container">
      <input
        className="inner-input"
        onChange={onChange}
        onKeyUp={onKeyUp}
        value={current}
      />
      <div style={{ margin: "auto", width: "16px", height: "16px" }}>
        <SearchIcon width="16px" height="16px" fill="var(--color-text)" />
      </div>
    </div>
  );
}
