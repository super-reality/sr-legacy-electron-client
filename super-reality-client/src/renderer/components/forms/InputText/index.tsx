/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Field, ErrorMessage } from "formik";
import { InputProps } from "..";
import TextError from "../TextError";

export default function InputText(props: InputProps<any>): JSX.Element {
  const { label, name, ...rest } = props;
  return (
    <div className="form-control">
      {label && <label htmlFor={name}>{label}</label>}
      <Field id={name} name={name} {...rest} />
      <ErrorMessage component={TextError} name={name} />
    </div>
  );
}
