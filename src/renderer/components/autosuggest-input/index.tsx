import {
  useEffect,
  CSSProperties,
  useState,
  useCallback,
  FocusEvent,
  KeyboardEvent,
} from "react";
import Autosuggest, { InputProps } from "react-autosuggest";
import "./index.scss";

const onFocus = (/* e: FocusEvent<HTMLElement> */): void => {
  // const input = e.target as HTMLInputElement;
  // We can trigger an action when we click the parent div
  // input.style.minWidth = "80px";
};

const onKeyUp = (e: KeyboardEvent<HTMLInputElement>): void => {
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
  style,
  selectClear,
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
  style?: CSSProperties;
  selectClear?: boolean;
}): JSX.Element {
  const [inputValue, setInputValue] = useState(initialValue ?? "");
  const [suggestions, setSuggestions] = useState([] as T[]);

  useEffect(() => {
    if (forceSuggestions) setSuggestions(forceSuggestions);
  }, [forceSuggestions]);

  const onChange = useCallback(
    (_event: unknown, { newValue }: { newValue: string }): void => {
      setInputValue(newValue);
      if (onChangeCallback) onChangeCallback(newValue);
    },
    []
  );

  const onSuggestionsFetchRequested = useCallback<Autosuggest.SuggestionsFetchRequested>(
    ({ value }: { value: string }): void => {
      if (filter) setSuggestions(filter(value));
    },
    []
  );

  const onSuggestionsClearRequested = useCallback<Autosuggest.OnSuggestionsClearRequested>(
    (): void => setSuggestions([]),
    []
  );

  const onSuggestionSelected = useCallback<Autosuggest.OnSuggestionSelected<T>>(
    (e, { suggestion, suggestionValue, method }): void => {
      submitCallback(suggestion);
      if (selectClear) setInputValue(initialValue ?? "");
      else if (method === "click") {
        setInputValue(suggestionValue);
      }
    },
    [initialValue, submitCallback]
  );

  const onBlur = useCallback(
    (
      e: FocusEvent<HTMLElement>,
      { highlightedSuggestion }: { highlightedSuggestion: T }
    ): void => {
      const val = highlightedSuggestion;
      if (val) {
        submitCallback(highlightedSuggestion);
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
    <div onFocus={onFocus} style={style}>
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
