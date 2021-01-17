/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Field, ErrorMessage, FieldProps } from "formik";
import { InputProps } from "..";
import TextError from "../TextError";
import "./index.scss";

export default function RadioButtons(props: InputProps): JSX.Element {
  const { label, name, options, ...rest } = props;
  return (
    <div className="form-control">
      <label>{label}</label>
      <Field name={name}>
        {({ field }: FieldProps) => {
          return (
            options &&
            options.map((option) => {
              return (
                <div key={option.key}>
                  <input
                    type="radio"
                    id={option.value}
                    {...field}
                    {...rest}
                    value={option.value}
                    checked={field.value === option.value}
                  />
                  <label htmlFor={option.value}>{option.key}</label>
                </div>
              );
            })
          );
        }}
      </Field>
      <ErrorMessage component={TextError} name={name} />
    </div>
  );
}
