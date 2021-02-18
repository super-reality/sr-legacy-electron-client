import { useState } from "react";

// simple hook to handle the input onChange event
export default function useTextInput(
  initialValue: string
): [
  string,
  (e: React.ChangeEvent<HTMLInputElement>) => void,
  (value: string) => void,
  () => void
] {
  const [value, setValue] = useState(initialValue);
  const resetInput = () => {
    setValue("");
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return [value, onChangeHandler, setValue, resetInput];
}
