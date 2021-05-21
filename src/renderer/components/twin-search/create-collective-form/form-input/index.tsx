import { InputChangeEv } from "../../../../../types/utils";
import "./index.scss";

interface NeuralFormInputProp {
  onChange: (e: InputChangeEv) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string;
  inputClassName?: string;
  placeholder: string;
}

export default function NeuralFormInput(
  props: NeuralFormInputProp
): JSX.Element {
  const { onChange, onKeyUp, value, inputClassName, placeholder } = props;
  return (
    <input
      className={`ai-form-input ${inputClassName}`}
      onChange={onChange}
      onKeyUp={onKeyUp}
      value={value}
      placeholder={placeholder}
    />
  );
}

/*
<div className="ai-form-input-container">

*/
