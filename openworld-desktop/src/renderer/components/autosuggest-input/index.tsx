import React from "react";
import Autosuggest, { InputProps } from "react-autosuggest";
import "./index.scss";

const onFocus = (e: React.FocusEvent<HTMLElement>): void => {
  const input = e.target as HTMLInputElement;
  // We can trigger an action when we click the parent div
  // input.style.minWidth = "80px";
};

const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>): void => {
  const input = e.target as HTMLInputElement;
  if (e.keyCode === 13) {
    input.blur();
    e.stopPropagation();
  } /* else {
    
    setTimeout(() => {
      input.style.width = `${Math.min(input.value.length * 8, 180)}px`;
    }, 10);
    
  }
  */
};

export default function AutosuggestInput<T>({
  getValue,
  renderSuggestion,
  filter,
  id,
  initialValue,
  placeholder,
  submitCallback,
}: {
  getValue: (suggestion: T) => string;
  renderSuggestion: (suggestion: T) => JSX.Element;
  filter: (str: string) => T[];
  id: string;
  initialValue?: string;
  placeholder?: string;
  submitCallback: (value: T) => void;
}): JSX.Element {
  const [inputValue, setInputValue] = React.useState(initialValue ?? "");
  const [suggestions, setSuggestions] = React.useState([] as T[]);

  const onChange = React.useCallback(
    (_event: unknown, { newValue }: { newValue: string }): void => {
      setInputValue(newValue);
    },
    []
  );

  const onSuggestionsFetchRequested = React.useCallback(
    ({ value }: { value: string }): void => setSuggestions(filter(value)),
    []
  );

  const onSuggestionsClearRequested = React.useCallback(
    (): void => setSuggestions([]),
    []
  );

  const onSuggestionSelected = React.useCallback(
    (_event, { suggestionValue, method }): void => {
      submitCallback(suggestionValue);
      if (method === "click") {
        setInputValue(suggestionValue);
      }
    },
    [initialValue, submitCallback]
  );

  const onBlur = React.useCallback(
    (
      e: React.FocusEvent<HTMLElement>,
      { highlightedSuggestion }: { highlightedSuggestion: T }
    ): void => {
      // const input = e.target as HTMLInputElement;
      const val = highlightedSuggestion;
      if (val) {
        submitCallback(highlightedSuggestion);
        // setInputValue(initialValue ?? "");
      }
      // setCellWrapperOverflow(input, "");
    },
    [initialValue, placeholder, submitCallback]
  );

  const inputProps: InputProps<T> = {
    autoComplete: "off",
    onBlur,
    onChange,
    onKeyUp,
    placeholder: placeholder ?? "",
    value: inputValue,
  };

  return (
    <div onFocus={onFocus}>
      <Autosuggest
        id={id}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    </div>
  );
}
