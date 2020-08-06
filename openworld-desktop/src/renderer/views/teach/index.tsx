import React from 'react';
import "./index.scss";
import TopSearch from '../../components/top-search';
import { LessonData } from '../../../types/teach';
import CreateLesson from '../../components/create-lesson';

const data: LessonData = {
  name: "Box Modelling",
  app: "Blender",
  description: {},
  steps: []
};

export default function Teach(): JSX.Element {
  return (
    <>
      <TopSearch />
      <CreateLesson data={data} />
    </>
  );
}
