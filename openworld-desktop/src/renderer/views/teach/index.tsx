import React from 'react';
import "./index.scss";
import { ILessonData } from '../../../types/api';
import CreateLesson from '../../components/create-lesson';
import { mockLessonData } from '../../../__mocks__/mocks';

export default function Teach(): JSX.Element {
  return (
    <>
      <CreateLesson data={mockLessonData} />
    </>
  );
}
