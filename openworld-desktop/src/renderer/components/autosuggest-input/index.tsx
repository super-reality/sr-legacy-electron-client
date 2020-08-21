import React, { useEffect } from "react";
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
  onChangeCallback,
  forceSuggestions,
}: {
  getValue: (suggestion: T) => string;
  renderSuggestion: (suggestion: T) => JSX.Element;
  filter?: (str: string) => T[];
  id: string;
  initialValue?: string;
  placeholder?: string;
  submitCallback: (value: T) => void;
  onChangeCallback?: (value: string) => void;
  forceSuggestions?: T[];
}): JSX.Element {
  const [inputValue, setInputValue] = React.useState(initialValue ?? "");
  const [suggestions, setSuggestions] = React.useState([] as T[]);

  useEffect(() => {
    if (forceSuggestions) setSuggestions(forceSuggestions);
  }, [forceSuggestions]);

  const onChange = React.useCallback(
    (_event: unknown, { newValue }: { newValue: string }): void => {
      setInputValue(newValue);
      if (onChangeCallback) onChangeCallback(newValue);
    },
    []
  );

  const onSuggestionsFetchRequested = React.useCallback<
    Autosuggest.SuggestionsFetchRequested
  >(({ value }: { value: string }): void => {
    if (filter) setSuggestions(filter(value));
  }, []);

  const onSuggestionsClearRequested = React.useCallback<
    Autosuggest.OnSuggestionsClearRequested
  >((): void => setSuggestions([]), []);

  const onSuggestionSelected = React.useCallback<
    Autosuggest.OnSuggestionSelected<T>
  >(
    (_event, { suggestion, suggestionValue, method }): void => {
      submitCallback(suggestion);
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
