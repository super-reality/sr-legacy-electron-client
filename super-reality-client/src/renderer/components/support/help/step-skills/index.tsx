/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Formik, Form, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import store from "../../../../redux/stores/renderer";
import reduxAction from "../../../../redux/reduxAction";
import TextError from "../../../forms/TextError";
import FormControl from "../../../forms";
import { StepSectionProps } from "..";

const titleSchema = Yup.object().shape({
  skills: Yup.array().min(1, "Please select at least one skill"),
});

interface Values {
  skills: any[];
}

const skillsOpts = [
  {
    name: "Blender",
    options: [
      { key: "3D Modeling", value: "3D Modeling" },
      { key: "Grease Pencil", value: "Grease Pencil" },
      { key: "Curve Editor", value: "Curve Editor" },
      { key: "Keyframe Animation", value: "Keyframe Animation" },
      { key: "Rendering", value: "Rendering" },
      { key: "Shaders", value: "Shaders" },
      { key: "Particles", value: "Particles" },
    ],
  },
  {
    name: "3D Animation",
    options: [
      { key: "Character", value: "Character" },
      { key: "Physics", value: "Physics" },
      { key: "Cars", value: "Cars" },
      { key: "Explosions", value: "Explosions" },
    ],
  },

  {
    name: "Teaching Style",
    options: [
      { key: "Video Chat", value: "Video Chat" },
      { key: "Text", value: "Text" },
      { key: "Easy Going", value: "Easy Going" },
      { key: "Micromanages", value: "Micromanages" },
    ],
  },
  {
    name: "What additional skills are important to accomplish this task?",
    options: [
      { key: "Game Developer", value: "Game Developer" },
      { key: "Programmer", value: "Programmer" },
      { key: "Unity Coder", value: "Unity Coder" },
      { key: "Pixel Artist", value: "Pixel Artist" },
    ],
  },
];

export default function StepSkills(props: StepSectionProps): JSX.Element {
  const { goNext, goBack, index } = props;

  const slice = store.getState().createSupportTicket;
  const dispatch = useDispatch();

  return (
    <div>
      <div className="title">Step {index} of 5</div>
      <Formik
        initialValues={{
          skills: slice.skills ? slice.skills : [],
        }}
        validationSchema={titleSchema}
        onSubmit={(values) => {
          reduxAction(dispatch, {
            type: "SET_SUPPORT_TICKET",
            arg: {
              skills: values.skills,
            },
          });
          goNext();

          console.log(values);
        }}
      >
        {(formik: FormikProps<Values>) => (
          <Form className="step">
            <div className="step-title">Skills</div>
            What are skills and expertise area most important to in your
            request? This will help pair you with teacher.
            <ErrorMessage component={TextError} name="skills" />
            {skillsOpts.map((skill) => (
              <div className="skill" key={skill.name}>
                {skill.name}
                <FormControl
                  name="skills"
                  control="skills"
                  options={skill.options}
                  {...formik}
                />
              </div>
            ))}
            {/*             <div className="skill">
              Blender
              <div className="skillset">
                <button type="button">+ 3D Modeling</button>
                <button type="button">+ Grease Pencil</button>
                <button type="button">+ Curve Editor</button>
                <button type="button">+ Keyframe Animation</button>
                <button type="button">+ Rendering</button>
                <button type="button">+ Shaders</button>
                <button type="button">+ Particles</button>
              </div>
            </div> */}
            <div className="skill">
              Not what you are looking for?
              <select>
                <option>Search Skills</option>
              </select>
            </div>
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
