/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Field, /*  ErrorMessage, */ FieldProps } from "formik";
import { InputProps } from "..";
/* import TextError from "../TextError"; */
import "./index.scss";

export default function CheckboxGroup(props: InputProps): JSX.Element {
  const { label, name, options, ...rest } = props;
  return (
    <div className="form-control-skills skillset">
      {label && <label>{label}</label>}
      <Field name={name}>
        {({ field }: FieldProps) => {
          return (
            options &&
            options.map((option) => {
              return (
                <React.Fragment key={option.key}>
                  <input
                    type="checkbox"
                    id={option.value}
                    {...field}
                    {...rest}
                    value={option.value}
                    checked={field.value.includes(option.value)}
                  />
                  <label className="checkbox-label" htmlFor={option.value}>
                    {option.key}
                  </label>
                </React.Fragment>
              );
            })
          );
        }}
      </Field>
    </div>
  );
}
