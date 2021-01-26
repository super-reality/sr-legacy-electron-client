/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Field, /*  ErrorMessage, */ FieldProps } from "formik";
import { InputProps } from "..";
/* import TextError from "../TextError"; */
/* import  { Iskills } from "../../../api/types/support-ticket/supportTicket"; */
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
                <React.Fragment key={option.id}>
                  <input
                    type="checkbox"
                    id={option.id}
                    {...field}
                    {...rest}
                    value={option.id}
                    checked={field.value.includes(option.id)}
                  />
                  <label className="checkbox-label" htmlFor={option.id}>
                    {option.name}
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
