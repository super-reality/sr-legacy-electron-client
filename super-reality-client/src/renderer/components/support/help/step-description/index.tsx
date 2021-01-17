/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import FormControl from "../../../forms";
import { StepSectionProps } from "..";

interface Values {
  description: string;
}

const descriptionSchema = Yup.object().shape({
  description: Yup.string()
    .min(20, "*Give us a litle more information pls")
    .max(100, "*Not so much information thanks")
    .required("*Required"),
});

export default function StepDescription(props: StepSectionProps): JSX.Element {
  const { goNext, goBack, index } = props;

  return (
    <div>
      <div className="title">Step {index} of 5</div>
      <Formik
        initialValues={{
          description: "",
          files: [],
        }}
        validationSchema={descriptionSchema}
        onSubmit={(values) => {
          goNext();

          console.log(values);
        }}
      >
        {(formik: FormikProps<Values>) => (
          <Form className="step">
            <div className="step-title">Description</div>A good description of
            your request includes:
            <ul>
              <li>Need to learn a skill? Tell us what it is!</li>
              <li>
                Dont see a lesson you want to learn? We can create it for you!
              </li>
              <li>Need a gaming buddy? We will find you one!</li>
            </ul>
            <FormControl name="description" control="textarea" {...formik} />
            <p>Additional files ( optional )</p>
            {/* <div className="upload-image">
              <label htmlFor="file">
                <span>drag or upload request images</span>.
              </label>
            </div> */}
            <FormControl name="files" control="file" {...formik} />
            <div className="support-buttons">
              <button onClick={goBack} type="button">
                Back
              </button>
              <button type="submit">Next</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
