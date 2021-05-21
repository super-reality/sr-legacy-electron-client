import { useState, useEffect } from "react";
import "./search-input.scss";
import { ReactComponent as SearchIcon } from "../../../../assets/svg/search.svg";
import { ReactComponent as MicIcon } from "../../../../assets/svg/mic-icon.svg";
import { InputChangeEv } from "../../../../types/utils";

interface InputSearchProps {
  onChange: (e: InputChangeEv) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  value: string;
  inputClassName?: string;
}

export default function TwinSearchInput(props: InputSearchProps): JSX.Element {
  const { value, onChange, onKeyUp, onClick, inputClassName } = props;
  const [current, setCurrent] = useState(value);

  useEffect(() => setCurrent(value), [value]);

  return (
    <div className="twin-input-wraper">
      <div className="twin-input-container">
        <div
          style={{ margin: "auto", width: "16px", height: "16px" }}
          onClick={onClick}
        >
          <SearchIcon width="16px" height="16px" fill="#A0A0B1" />
        </div>
        <input
          className={`twin-input ${inputClassName}`}
          onChange={onChange}
          onKeyUp={onKeyUp}
          value={current}
          placeholder="Search Realities ..."
        />
        <div style={{ margin: "auto", width: "16px", height: "16px" }}>
          <MicIcon width="16px" height="16px" fill="#A0A0B1" />
        </div>
      </div>
    </div>
  );
}
