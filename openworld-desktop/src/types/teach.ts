export interface IStep {
  id: string;
  title: string;
  rating: number;
}

export interface ILessonData {
  name: string;
  app: string;
  description: any;
  steps: IStep[];
};
