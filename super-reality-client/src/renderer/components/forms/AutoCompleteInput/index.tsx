/* eslint-disable react/jsx-props-no-spreading */
import "./index.scss";
import React from "react";
import { InputProps } from "..";
import AutosuggestInput from "../../autosuggest-input";
import { IData } from "../../../api/types/support-ticket/supportTicket";

export default function AutoCompleteInput(props: InputProps): JSX.Element {
  const { setFieldValue, name,secondaryName, values, options, action } = props;

  const iff = (condition: any, then: any, otherwise: any) =>
    condition ? then : otherwise;

  const filterOptions = (
    opts: IData[],
    inputValue: string,
    inputLength: number
  ) => {
    const array = opts.filter((option: IData) => {
      return option.name.toLowerCase().slice(0, inputLength) === inputValue;
    });

    return array.length > 0 ?array : [{ id: inputValue, name: inputValue }];
      
  };

  const filter = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : iff(
          options,
          options && filterOptions(options, inputValue, inputLength),
          []
        );
  };

  const getSingleName = (id: string, array: IData[]): string => {
    const i = array.map((el) => el.id).indexOf(id);
    if (i !== -1) return array[i].name;
    return name;
  };

  const setValue = (value: IData) => {
    if (values[name] && Array.isArray(values[name])) {
      setFieldValue(name, values[name].concat(value.id));
    } else {
      setFieldValue(name, value.id);
    }

    if(secondaryName){
      if (values[secondaryName] && Array.isArray(values[secondaryName])) {
        setFieldValue(secondaryName, values[secondaryName].concat(value.name));
      } else {
        setFieldValue(secondaryName, value.name);
      }
    }
    if (action) action(value);
  };
  const renderSuggestion = (suggestion: IData) => {
    return <span>{suggestion.name}</span>;
  };

  return (
    <AutosuggestInput<IData>
      filter={filter}
      getValue={(suggestion) => suggestion.name}
      renderSuggestion={renderSuggestion}
      submitCallback={setValue}
      initialValue={
        options && values[name] ? getSingleName(values[name], options) : ""
      }
      id={name}
    />
  );
}
