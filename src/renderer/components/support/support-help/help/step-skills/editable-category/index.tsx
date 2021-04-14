/* eslint-disable react/jsx-props-no-spreading */

import "./index.scss";
import { FormikProps } from "formik";
import FormControl from "../../../../../forms";
import { IData } from "../../../../../../api/types/support-ticket/supportTicket";

interface ISingleSkill {
  index: number;
  options: IData[];
  context: FormikProps<any>;
}

export default function SingleCategory(props: ISingleSkill): JSX.Element {
  const { options, context, index } = props;
  const { values } = context;
  return (
    <div className="skill" key={index}>
      <FormControl
        name={`newCategories[${index}].name`}
        secondaryName={
          values.newCategories[index]
            ? values.newCategories[index].name
            : "new name"
        }
        control="editable"
        placeholder="new name"
        {...context}
      />

      <FormControl
        name="skills"
        control="skills"
        options={options}
        {...context}
      />
    </div>
  );
}
