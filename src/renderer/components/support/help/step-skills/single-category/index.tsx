/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { FormikProps } from "formik";
import FormControl from "../../../../forms";
import { IData } from "../../../../../api/types/support-ticket/supportTicket";

interface ISingleSkill {
  name: string;
  options: IData[];
  context: FormikProps<any>;
}

export default function SingleCategory(props: ISingleSkill): JSX.Element {
  const { name, options, context } = props;
  return (
    <div className="skill" key={name}>
      {name}

      <FormControl
        name="skills"
        control="skills"
        options={options}
        {...context}
      />
    </div>
  );
}
