/* eslint-disable import/prefer-default-export */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { FormikProps } from "formik";
import InputText from "./InputText";
import RadioButtons from "./RadioButtons";
import TextArea from "./TextArea";
import DropFile, { uploadFiles } from "./DropFile";
import SkillsCheckbox from "./SkillsCheckbox";
import AutoCompleteInput, { capitalize } from "./AutoCompleteInput";
import { IData } from "../../api/types/support-ticket/supportTicket";

import ImagesPreview from "./DropFile/ImagePreview";

export { capitalize };
export { uploadFiles };
export { ImagesPreview };

export const getNames = (array: string[], arrayData: IData[]): IData[] => {
  const resultArray: IData[] = [];
  array.forEach((el) => {
    const i = arrayData.map((ele) => ele._id).indexOf(el);
    if (i !== -1) resultArray.push(arrayData[i]);
  });

  return resultArray;
};

export const valuetoIData = (array: string[]): IData[] => {
  let ArrayData: IData[] = [];
  ArrayData = array.map((e) => ({ _id: e, name: e }));

  return ArrayData;
};

export const singleValuetoIData = (value: string): IData => {
  return { _id: value, name: value, new: true };
};

export const getSingleName = (name: string, array: IData[]): string => {
  const i = array.map((el) => el._id).indexOf(name);
  if (i !== -1) return array[i].name;
  return name;
};

export interface InputProps extends FormikProps<any> {
  name: string;
  secondaryName?: string;
  className?: string;
  label?: string;
  placeholder?: string;
  options?: IData[];
  action?: (value: IData) => void;
  valuesSet?: (value: any) => void;
  filter?: (value: any) => any[];
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
    case "skills":
      return <SkillsCheckbox {...rest} />;
    case "autocomplete":
      return <AutoCompleteInput {...rest} />;

    default:
      return <></>;
  }
}
