/* eslint-disable import/prefer-default-export */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { FormikProps } from "formik";
import InputText from "./InputText";
import RadioButtons from "./RadioButtons";
import TextArea from "./TextArea";
import DropFile from "./DropFile";
import SkillsCheckbox from "./SkillsCheckbox";
import AutoCompleteInput from "./AutoCompleteInput";

export interface InputProps<T> extends FormikProps<any> {
  name: string;
  secondaryName?: string;
  className?: string;
  label?: string;
  placeholder?: string;
  options?: T[];
  action?: (value: T) => void;
  valuesSet?: (value: T) => void;
}

interface FormControlInput<T> extends InputProps<T> {
  control: string;
}

export default function FormControl<T>({
  control,
  ...rest
}: FormControlInput<T>): JSX.Element {
  switch (control) {
    case "text":
      return <InputText {...rest} />;
    case "radio":
      return <RadioButtons {...rest} />;
    case "textarea":
      return <TextArea {...rest} />;
    case "file":
      return <DropFile {...rest} />;
    case "skills":
      return <SkillsCheckbox {...rest} />;
    case "autocomplete":
      return <AutoCompleteInput {...rest} />;

    default:
      return <></>;
  }
}
