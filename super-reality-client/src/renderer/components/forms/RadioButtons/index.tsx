/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Field, ErrorMessage, FieldProps } from "formik";
import { InputProps } from "..";
import TextError from "../TextError";
import "./index.scss";

export default function RadioButtons(props: InputProps<any>): JSX.Element {
  const { label, name, options, ...rest } = props;
  return (
    <div className="form-control">
      <label>{label}</label>
      <Field name={name}>
        {({ field }: FieldProps) => {
          return (
            options &&
            options.slice(0, 3).map((option) => {
              return (
                <div key={option._id}>
                  <input
                    type="radio"
                    id={option._id}
                    {...field}
                    {...rest}
                    value={option._id}
                    checked={field.value === option._id}
                  />
                  <label htmlFor={option._id}>{option.name}</label>
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
