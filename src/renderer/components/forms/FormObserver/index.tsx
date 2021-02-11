import { useEffect } from "react";

interface Props<T> {
  onChange: (value: T) => void;
  value: T;
}

export default function FormObserver<T>(props: Props<T>) {
  const { onChange, value } = props;
  useEffect(() => {
    onChange(props.value);
  }, [Object.values(value).join(", ")]);
  return null;
}

FormObserver.defaultProps = {
  onChange: () => null,
};
