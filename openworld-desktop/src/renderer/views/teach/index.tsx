import React from 'react';
import "./index.scss";
import TopSearch from '../../components/top-search';
import { ILessonData } from '../../../types/teach';
import CreateLesson from '../../components/create-lesson';

const data: ILessonData = {
  name: "Box Modelling",
  app: "Blender",
  description: {},
  steps: [
    {
      id: "12",
      title: "Awesomeness",
      rating: 99
    },
    {
      id: "01",
      title: "Juice",
      rating: 45
    },
    {
      id: "78",
      title: "Draw bolts",
      rating: 42
    },
    {
      id: "56",
      title: "Hit something",
      rating: 37
    },
  ]
};

export default function Teach(): JSX.Element {
  return (
    <>
      <TopSearch />
      <CreateLesson data={data} />
    </>
  );
}
