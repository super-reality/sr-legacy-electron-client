import React from "react";
import "./index.scss";

interface SwitchProps {
  value: boolean;
  callback: (value: boolean) => void;
  disabled?: boolean;
}

export default function Toggle(props: SwitchProps): JSX.Element {
  const { disabled, value, callback } = props;
  const [currentValue, setCurrentValue] = React.useState(value);

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      if (!disabled) {
        const newValue = event.target.checked;
        callback(newValue);
        setCurrentValue(newValue);
      }
    },
    [callback, disabled]
  );

  const disabledStyle = disabled
    ? {
        cursor: "default",
        color: "var(--color-text-disabled)",
      }
    : {};

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  return (
    <label className="switch">
      <input type="checkbox" checked={currentValue} onChange={onChange} />
      <span style={disabledStyle} className="slider" />
    </label>
  );
}
