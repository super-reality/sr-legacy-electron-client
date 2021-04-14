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
          const values: string[] = field.value.map((skill: string) => {
            return JSON.parse(skill)._id;
          });

          console.log(values);
          return (
            options &&
            options.map((option) => {
              const fieldCopy = {
                ...field,
                onChange: (e: any) => {
                  if (values.includes(option._id)) {
                    const valuesCopy = [...field.value];
                    const skillIndex = valuesCopy
                      .map((sk: string) => {
                        return JSON.parse(sk)._id;
                      })
                      .indexOf(option._id);

                    valuesCopy.splice(skillIndex, 1);
                    rest.setFieldValue("skills", valuesCopy);

                    if (option.new) {
                      const newValuesCopy = [...rest.values.newSkills];
                      const newSkillIndex = newValuesCopy
                        .map((sk: string) => {
                          return JSON.parse(sk)._id;
                        })
                        .indexOf(option._id);
                      newValuesCopy.splice(newSkillIndex, 1);
                      rest.setFieldValue("newSkills", newValuesCopy);
                    }
                  } else {
                    field.onChange(e);
                  }
                },
              };
              return (
                <React.Fragment key={option._id}>
                  <input
                    type="checkbox"
                    id={option._id}
                    {...fieldCopy}
                    value={`{"_id":"${option._id}","name":"${option.name}"}`}
                    checked={values.includes(option._id)}
                  />
                  <label className="checkbox-label" htmlFor={option._id}>
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
