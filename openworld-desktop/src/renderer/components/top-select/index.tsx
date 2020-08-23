import React from "react";
import "./index.scss";

interface ReactSelectProps<K> {
  optionFormatter?: (option: K | string) => string | JSX.Element;
  current: K;
  callback: (option: K) => void;
  options: K[];
  className?: string;
  style?: React.CSSProperties;
}

export default function ReactSelect<K>({
  optionFormatter,
  current,
  callback,
  options,
  className,
  style,
}: ReactSelectProps<K>): JSX.Element {
  const formatterFunc =
    typeof optionFormatter === "function"
      ? optionFormatter
      : (inString: string | K): string | K => inString;

  const [currentOption, setCurrentOption] = React.useState<K>(current);
  const [optionsOpen, setOptionsOpen] = React.useState(false);
  React.useEffect(() => setCurrentOption(current), [current]);

  const onClickSelect = React.useCallback(() => {
    setOptionsOpen(!optionsOpen);
  }, [optionsOpen]);

  const onClickOption = React.useCallback(
    (event) => {
      setCurrentOption(event.currentTarget.value);
      setOptionsOpen(false);
      if (callback) callback(event.currentTarget.value);
    },
    [callback]
  );

  const buttonClassNames = `select-button ${className} ${
    optionsOpen ? "active" : ""
  }`;

  return (
    <div className={`select-container ${className}`} style={style}>
      <button
        type="button"
        key={`${currentOption}-key`}
        className={buttonClassNames}
        onClick={onClickSelect}
      >
        {formatterFunc(currentOption)}
      </button>
      {optionsOpen && (
        <div className={`select-options-container ${className}`}>
          {options.map((option) => {
            return typeof option === "string" && option.startsWith("%%") ? (
              <div className={`select-title ${className}`} key={option}>
                {option.replace("%%", "")}
              </div>
            ) : (
              <button
                type="button"
                className={`select-option ${className} ${
                  option === currentOption ? "disabled" : ""
                }`}
                key={`${option}--option-key`}
                value={`${option}`}
                disabled={option === currentOption}
                onClick={onClickOption}
              >
                {formatterFunc(option)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
