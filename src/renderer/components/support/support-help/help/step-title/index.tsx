/* eslint-disable react/jsx-props-no-spreading */

import React, { useState } from "react";
import { Formik, Form, FormikProps } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import store from "../../../../../redux/stores/renderer";
import reduxAction from "../../../../../redux/reduxAction";
import FormControl, { capitalize } from "../../../../forms";
import { StepSectionProps } from "..";
import getCategories from "../../support-help-utils/getCategories";
import { IData } from "../../../../../api/types/support-ticket/supportTicket";

const titleSchema = Yup.object().shape({
  title: Yup.string()
    .min(10, "*Give us a litle more information pls")
    .max(150, "*Not so much information thanks")
    .required("*Required"),
  category: Yup.string().required("*Please select a category"),
});
interface Values {
  title: string | undefined;
  category: string | undefined;
  newCategoryName: string | undefined;
}

let searchedCategories: IData[] = [];

const searchCategories = (value: string): IData[] => {
  getCategories(value).then((categories) => {
    searchedCategories = [...categories];
  });

  return searchedCategories.length > 0
    ? searchedCategories
    : [{ _id: capitalize(value), name: capitalize(value), new: true }];
};

export default function StepTitle(props: StepSectionProps): JSX.Element {
  const slice = store.getState().createSupportTicket;
  const [usedCategories, setUsedCategories] = useState(slice.categoryData);
  const dispatch = useDispatch();
  const { goNext, goBack, index } = props;

  const modifyUsedCategories = (value: IData) => {
    if (usedCategories) {
      const array: IData[] = [...usedCategories];
      const i = array.map((e) => e._id).indexOf(value._id);
      array.splice(i, 1);
      array.unshift(value);
      setUsedCategories(array);
    }
  };

  return (
    <div>
      <div className="title">Step {index} of 5</div>

      <Formik
        initialValues={{
          title: slice.title,
          category: slice.category,
          newCategoryName: slice.newCategoryName,
        }}
        validationSchema={titleSchema}
        onSubmit={(values) => {
          reduxAction(dispatch, {
            type: "SET_SUPPORT_TICKET",
            arg: {
              title: values.title,
              category: values.category,
              categoryData: usedCategories,
              newCategoryName: values.newCategoryName,
              newCategory:
                values.newCategoryName !== "" &&
                values.newCategoryName === values.category,
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
              options={usedCategories}
              {...formik}
            />
            <span>Find one!</span>
            <FormControl
              name="category"
              secondaryName="newCategoryName"
              control="autocomplete"
              options={slice.categoryData}
              action={modifyUsedCategories}
              placeholder="Search for categories"
              filter={searchCategories}
              {...formik}
            />

            {/* <AutosuggestInput/> */}

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
