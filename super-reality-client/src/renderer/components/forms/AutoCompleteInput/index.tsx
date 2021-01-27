/* eslint-disable react/jsx-props-no-spreading */
import "./index.scss";
import React from "react";
import { InputProps } from "..";
import AutosuggestInput from "../../autosuggest-input";
import { IData } from "../../../api/types/support-ticket/supportTicket";

export const capitalize = (string: string) => {
  return string.replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function AutoCompleteInput(props: InputProps): JSX.Element {
  const {
    setFieldValue,
    name,
    secondaryName,
    values,
    options,
    action,
    placeholder,
    valuesSet,
    filter,
  } = props;

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

    return array.length > 0
      ? array
      : [
          {
            _id: capitalize(inputValue),
            name: capitalize(inputValue),
            new: true,
          },
        ];
  };

  const filterOpt = (value: string) => {
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

  const getSingleName = (_id: string, array: IData[]): string => {
    const i = array.map((el) => el._id).indexOf(_id);
    if (i !== -1) return array[i].name;
    return "";
  };

  const setValue = (value: IData) => {
    console.log(value);

    if (valuesSet) {
      valuesSet(value);
    } else {
      if (values[name] && Array.isArray(values[name])) {
        setFieldValue(name, values[name].concat(value._id));
      } else {
        setFieldValue(name, value._id);
      }

      if (secondaryName && value.new) {
        if (values[secondaryName] && Array.isArray(values[secondaryName])) {
          setFieldValue(
            secondaryName,
            values[secondaryName].concat(value.name)
          );
        } else {
          setFieldValue(secondaryName, value.name);
        }
      }
    }
    if (action) action(value);
  };

  const renderSuggestion = (suggestion: IData) => {
    if (suggestion.new) {
      return (
        <div>
          New {capitalize(name)} : {suggestion.name}
        </div>
      );
    }
    return <div>{suggestion.name}</div>;
  };

  return (
    <AutosuggestInput<IData>
      filter={filter ?? filterOpt}
      getValue={(suggestion) => suggestion.name}
      renderSuggestion={renderSuggestion}
      submitCallback={setValue}
      initialValue={
        options && values[name] ? getSingleName(values[name], options) : ""
      }
      id={name}
      placeholder={placeholder}
    />
  );
}
