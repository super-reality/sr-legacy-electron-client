/* eslint-disable react/jsx-props-no-spreading */
import { Formik, Form, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import reduxAction from "../../../../../redux/reduxAction";
import { AppState } from "../../../../../redux/stores/renderer";
import TextError from "../../../../forms/TextError";
import { StepSectionProps } from "..";
import { IVibe } from "../../../../../api/types/support-ticket/supportTicket";
import FormControl from "../../../../forms";

interface Values {
  vibes: IVibe[];
}

const vibesSchema = Yup.object().shape({
  vibes: Yup.array().min(3, "Please select at least three vibes"),
});

export default function StepVibes(props: StepSectionProps): JSX.Element {
  const { goBack, goNext, index } = props;
  const { vibes } = useSelector((state: AppState) => state.createSupportTicket);
  const dispatch = useDispatch();
  return (
    <div>
      <div className="title">Step {index} of 5</div>
      <Formik
        initialValues={{ vibes: vibes }}
        validationSchema={vibesSchema}
        onSubmit={(values) => {
          console.log(values);
          reduxAction(dispatch, {
            type: "SET_SUPPORT_TICKET",
            arg: {
              vibes: values.vibes,
            },
          });
          goNext();
        }}
      >
        {(formik: FormikProps<Values>) => (
          <Form className="step">
            <div className="step-title">Vibes</div>
            What vibes are you feeling in the moment of the request? This will
            help you pair with a teacher who can also help you
            <ErrorMessage component={TextError} name="vibes" />
            <FormControl control="vibes" name="vibes" {...formik} />
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
