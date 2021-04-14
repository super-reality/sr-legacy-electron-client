/* eslint-disable react/jsx-props-no-spreading */
import "./index.scss";
import React, { useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import store from "../../../../../redux/stores/renderer";
import reduxAction from "../../../../../redux/reduxAction";
import FormControl, { FormObserver } from "../../../../forms";
import { StepSectionProps } from "..";

interface Values {
  description: string | undefined;
}

export interface Iimages {
  lastModified: number;
  name: string;
  path: string;
  size: number;
  type: string;
}

const descriptionSchema = Yup.object().shape({
  description: Yup.string()
    .min(50, "*Give us a litle more information pls")
    .max(5000, "*Not so much information thanks")
    .required("*Required"),
});

export default function StepDescription(props: StepSectionProps): JSX.Element {
  const { goNext, goBack, index } = props;
  const slice = store.getState().createSupportTicket;
  const dispatch = useDispatch();

  const [descriptionLenght, setDescriptionLenght] = useState<number>(0);

  return (
    <div>
      <div className="title">Step {index} of 5</div>
      <Formik
        initialValues={{
          description: slice.description,
          images: slice.images,
        }}
        validationSchema={descriptionSchema}
        onSubmit={(values) => {
          reduxAction(dispatch, {
            type: "SET_SUPPORT_TICKET",
            arg: {
              description: values.description,
              images: values.images,
            },
          });

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
            <div className="description-count">
              <p>{`${descriptionLenght}/5000 (50 minimum)`}</p>
            </div>
            <p>Additional files ( optional )</p>
            <FormControl name="images" control="file" {...formik} />
            <FormObserver
              value={formik.values.description}
              onChange={(value: typeof formik.values.description) => {
                if (value) {
                  if (value.length == 0) {
                    setDescriptionLenght(0);
                  } else {
                    setDescriptionLenght(value?.length);
                  }
                }
              }}
            />
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
