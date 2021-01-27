/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef } from "react";
import { Formik, Form, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import store from "../../../../redux/stores/renderer";
import reduxAction from "../../../../redux/reduxAction";
import TextError from "../../../forms/TextError";
import FormControl from "../../../forms";
import { StepSectionProps } from "..";
import supportTicket, {
  IData,
} from "../../../../api/types/support-ticket/supportTicket";

const titleSchema = Yup.object().shape({
  skills: Yup.array().min(1, "Please select at least one skill"),
});

interface Values {
  skills: string[];
  newSkills: string[];
}

const skillsOpts = [
  {
    name: "Blender",
    options: [
      { id: "3D Modeling", name: "3D Modeling" },
      { id: "Grease Pencil", name: "Grease Pencil" },
      { id: "Curve Editor", name: "Curve Editor" },
      { id: "idframe Animation", name: "idframe Animation" },
      { id: "Rendering", name: "Rendering" },
      { id: "Shaders", name: "Shaders" },
      { id: "Particles", name: "Particles" },
    ],
  },
  {
    name: "3D Animation",
    options: [
      { id: "Character", name: "Character" },
      { id: "Physics", name: "Physics" },
      { id: "Cars", name: "Cars" },
      { id: "Explosions", name: "Explosions" },
    ],
  },

  {
    name: "Teaching Style",
    options: [
      { id: "Video Chat", name: "Video Chat" },
      { id: "Text", name: "Text" },
      { id: "Easy Going", name: "Easy Going" },
      { id: "Micromanages", name: "Micromanages" },
    ],
  },
  {
    name: "What additional skills are important to accomplish this task?",
    options: [
      { id: "Game Developer", name: "Game Developer" },
      { id: "Programmer", name: "Programmer" },
      { id: "Unity Coder", name: "Unity Coder" },
      { id: "Pixel Artist", name: "Pixel Artist" },
    ],
  },
];

export default function StepSkills(props: StepSectionProps): JSX.Element {
  const { goNext, goBack, index } = props;

  const formRef = useRef<FormikProps<Values>>(null);

  const slice = store.getState().createSupportTicket;
  const dispatch = useDispatch();

  const [addedSkills, setAddedSkills] = useState<IData[]>(
    slice.searchedSkills ?? []
  );

  const addExtraSkill = (value: IData) => {
    const array = [...addedSkills];
    const i = array.map((e) => e.id).indexOf(value.id);
    if (i == -1) {
      array.push(value);
      setAddedSkills(array);
    }
  };

  const valuetoIData = (array: string[]): IData[] => {
    let ArrayData: IData[] = [];
    ArrayData = array.map((e) => ({ id: e, name: e }));

    return ArrayData;
  };

  const setValues = (value: IData): void => {
    const values = formRef.current?.values;
    const setFieldValue = formRef.current?.setFieldValue;

    if (setFieldValue && values) {
      setFieldValue("skills", values.skills.concat(value.id));
      if (value.new)
        setFieldValue("newSkills", values.newSkills.concat(value.id));
    }
  };

  const initialValues: Values = {
    skills: slice.skills ?? [],
    newSkills: slice.newSkills ?? [],
  };

  return (
    <div>
      <div className="title">Step {index} of 5</div>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={titleSchema}
        onSubmit={(names) => {
          reduxAction(dispatch, {
            type: "SET_SUPPORT_TICKET",
            arg: {
              skills: names.skills,
              searchedSkills: addedSkills,
              newSkills: names.newSkills,
              skillsData: slice.skillsData && [
                ...slice.skillsData,
                ...valuetoIData(names.newSkills),
              ],
            } as supportTicket,
          });
          goNext();

          console.log(names);
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
            <div className="skill">
              Not what you are looking for?
              <FormControl
                name="skills"
                secondaryName="newSkills"
                control="autocomplete"
                options={slice.skillsData}
                action={addExtraSkill}
                placeholder="Search for skills"
                valuesSet={setValues}
                {...formik}
              />
              <FormControl
                name="skills"
                control="skills"
                options={addedSkills}
                {...formik}
              />
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
