export interface IBase {
  id: string;
  name: string;
  avatarUrl: string;
  creator: string;
  rating: number;
  checkState: boolean;
}

export interface IStep extends IBase {
  id: string;
  media: string[];
  description: string;
}

export interface ILessonData extends IBase {
  purpose: string;
  subjectName: string;
  media: string[];
  steps: IStep[];
}

export interface ISubjectData extends IBase {
  purpose: string;
  media: string[];
  lessons: ILessonData[];
}

export interface ICollectionData extends IBase {
  purpose: string;
  media: string[];
  subjects: ISubjectData[];
}
