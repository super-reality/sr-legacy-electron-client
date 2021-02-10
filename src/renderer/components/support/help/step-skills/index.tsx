/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef, /*  useEffect, */ useMemo } from "react";
import "./index.scss";
import { Formik, Form, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import store from "../../../../redux/stores/renderer";
import reduxAction from "../../../../redux/reduxAction";
import TextError from "../../../forms/TextError";
import FormControl, { capitalize, singleValuetoIData } from "../../../forms";
import { StepSectionProps } from "..";
import GetSkills from "../../support-utils/getSkills";
import SingleCategory from "./single-category";
/* import EditableCategory from "./editable-category";

import { ReactComponent as AddButtonIcon } from "../../../../../assets/svg/add-btn.svg"; */

import supportTicket, {
  IData,
  IDataGet,
} from "../../../../api/types/support-ticket/supportTicket";

const titleSchema = Yup.object().shape({
  skills: Yup.array().min(1, "Please select at least one skill"),
});

interface Values {
  skills: string[];
  newSkillName: string;
  newCategories: any[];
}

const skillsOpts = [
  {
    name: "Blender",
    options: [
      { _id: "3D Modeling", name: "3D Modeling" },
      { _id: "Grease Pencil", name: "Grease Pencil" },
      { _id: "Curve Editor", name: "Curve Editor" },
      { _id: "idframe Animation", name: "idframe Animation" },
      { _id: "Rendering", name: "Rendering" },
      { _id: "Shaders", name: "Shaders" },
      { _id: "Particles", name: "Particles" },
    ],
  },
  {
    name: "3D Animation",
    options: [
      { _id: "Character", name: "Character" },
      { _id: "Physics", name: "Physics" },
      { _id: "Cars", name: "Cars" },
      { _id: "Explosions", name: "Explosions" },
    ],
  },

  {
    name: "Teaching Style",
    options: [
      { _id: "Video Chat", name: "Video Chat" },
      { _id: "Text", name: "Text" },
      { _id: "Easy Going", name: "Easy Going" },
      { _id: "Micromanages", name: "Micromanages" },
    ],
  },
  {
    name: "What additional skills are important to accomplish this task?",
    options: [
      { _id: "Game Developer", name: "Game Developer" },
      { _id: "Programmer", name: "Programmer" },
      { _id: "Unity Coder", name: "Unity Coder" },
      { _id: "Pixel Artist", name: "Pixel Artist" },
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

  const [subCategories, setSubCategories] = useState<any[]>([]);
  /*  const [newSubCategories, setNewSubCategories] = useState<any[]>([]); */

  useMemo(() => {
    setSubCategories([...skillsOpts]);
  }, []);

  let searchedSkills: IData[] = [];

  const SearchSkills = (value: string): IData[] => {
    console.log(value);
    GetSkills(value)
      .then((skills: IDataGet[]) => {
        searchedSkills = [...skills];
      })
      .catch((e) => console.log(e));

    return searchedSkills.length > 0
      ? searchedSkills
      : [{ _id: capitalize(value), name: capitalize(value), new: true }];
  };

  /*   const addNewCategory = () => {
    const array = [...newSubCategories];
    array.push({
      name: "",
      options: [],
    });

    setNewSubCategories(array);

    const setFieldValue = formRef.current?.setFieldValue;
    const values = formRef.current?.values;

    if (setFieldValue)
      setFieldValue(
        "newCategories",
        values?.newCategories.concat([
          {
            name: "",
            options: [],
          },
        ])
      );
  };
 */
  const addExtraSkill = (value: IData) => {
    const array = [...addedSkills];
    const i = array.map((e) => e._id).indexOf(value._id);
    if (i == -1) {
      array.push(value);
      setAddedSkills(array);
    }
  };

  function setValues(value: IData): void {
    console.log(value);
    const values = formRef.current?.values;
    const setFieldValue = formRef.current?.setFieldValue;

    if (setFieldValue && values) {
      setFieldValue("skills", values.skills.concat(value._id));
      if (value.new)
        /*  setFieldValue("newSkillName", values.newSkillName.concat(value._id)); */
        setFieldValue("newSkillName", value._id);
    }
  }

  const initialValues: Values = {
    skills: slice.skills ?? [],
    newSkillName: slice.newSkillName ?? "",
    newCategories: [],
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
              newSkillName: names.newSkillName,
              skillsData: slice.skillsData?.concat(
                singleValuetoIData(names.newSkillName),
                addedSkills
              ) /* slice.skillsData && [
                ...slice.skillsData,
                ...valuetoIData(names.newSkillName),
              ] */,
              newSkill: names.newSkillName != "",
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
            {subCategories.map((skill) => (
              <SingleCategory
                key={skill.name}
                name={skill.name}
                options={skill.options}
                context={{ ...formik }}
              />
            ))}
            {/*             {newSubCategories.map((c, i) => (
              <EditableCategory
                key={c.name}
                index={i}
                options={c.options}
                context={{ ...formik }}
              />
            ))} */}
            {/*             <div className="addSkill skill">
              <AddButtonIcon onClick={addNewCategory} />
              Add New category
            </div> */}
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
                filter={SearchSkills}
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
              {/* <button onClick={addNewCategory} type="button">
                Random
              </button> */}
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
