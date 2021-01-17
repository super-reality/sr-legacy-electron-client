/* eslint-disable import/prefer-default-export */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { FormikProps } from "formik";
import InputText from "./InputText";
import RadioButtons from "./RadioButtons";
import TextArea from "./TextArea";
import DropFile from "./DropFile";
/* export interface radioOption {
  key: string;
  value: string;
} */

export interface InputProps extends FormikProps<any> {
  name: string;
  className?: string;
  label?: string;
  placeholder?: string;
  options?: any[];
}

interface FormControlInput extends InputProps {
  control: string;
}

export default function FormControl({
  control,
  ...rest
}: FormControlInput): JSX.Element {
  switch (control) {
    case "text":
      return <InputText {...rest} />;
    case "radio":
      return <RadioButtons {...rest} />;
    case "textarea":
      return <TextArea {...rest} />;
    case "file":
      return <DropFile {...rest} />;

    default:
      return <></>;
  }
}
