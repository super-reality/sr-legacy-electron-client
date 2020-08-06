import React from 'react';
import "./index.scss";
import TopSearch from '../../components/top-search';
import Lesson from '../../components/lesson';
import { LessonData } from '../../../types/teach';

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
      <Lesson data={data} />
    </>
  );
}
