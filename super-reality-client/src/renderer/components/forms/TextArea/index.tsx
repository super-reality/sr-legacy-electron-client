/* eslint-disable react/jsx-props-no-spreading */
import "./index.scss";
import React from "react";
import { Field, ErrorMessage } from "formik";
import { InputProps } from "..";
import TextError from "../TextError";

export default function Textarea(props: InputProps<any>): JSX.Element {
  const { label, name, ...rest } = props;
  return (
    <div className="form-control">
      <label htmlFor={name}>{label}</label>
      <Field as="textarea" id={name} name={name} {...rest} />
      <ErrorMessage component={TextError} name={name} />
    </div>
  );
}
