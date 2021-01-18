/* eslint-disable react/jsx-props-no-spreading */

import React from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import store from "../../../../redux/stores/renderer";
import reduxAction from "../../../../redux/reduxAction";
import FormControl from "../../../forms";
import { StepSectionProps } from "..";

const RadioButtonOptions = [
  { key: "Blender Animation", value: "Blender Animation" },
  { key: "3D Animation", value: "3D Animation" },
  { key: "2D Pixel Art Animation", value: "2D Pixel Art Animation" },
];
const titleSchema = Yup.object().shape({
  title: Yup.string()
    .min(10, "*Give us a litle more information pls")
    .max(50, "*Not so much information thanks")
    .required("*Required"),
  category: Yup.string().required("*Please select a category"),
});

interface Values {
  title: string | undefined;
  category: string | undefined;
}

export default function StepTitle(props: StepSectionProps): JSX.Element {
  const slice = store.getState().createSupportTicket;
  const dispatch = useDispatch();
  const { goNext, goBack, index } = props;

  return (
    <div>
      <div className="title">Step {index} of 5</div>

      <Formik
        initialValues={{
          title: slice.title,
          category: slice.category,
        }}
        validationSchema={titleSchema}
        onSubmit={(values) => {
          reduxAction(dispatch, {
            type: "SET_SUPPORT_TICKET",
            arg: {
              title: values.title,
              category: values.category,
            },
          });
          goNext();

          console.log(values);
        }}
      >
        {(formik: FormikProps<Values>) => (
          <Form className="step">
            <div className="step-title">Title</div>
            <span>Enter the name of your request</span>
            <FormControl
              name="title"
              control="text"
              placeholder="I can't animate in Blender!"
              {...formik}
            />

            <p>What can you request? Anything...we are here to help. </p>

            <ul>
              <li>Need to learn a skill? Tell us what it is!</li>
              <li>
                Dont see a lesson you want to learn? We can create it for you!
              </li>
              <li>Need a gaming buddy? We will find you one!</li>
            </ul>

            <span>Request Category</span>

            <FormControl
              name="category"
              control="radio"
              options={RadioButtonOptions}
              {...formik}
            />

            <a className="see-more">See more options</a>

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
