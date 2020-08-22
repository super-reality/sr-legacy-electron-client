import Category from "../../../types/collections";

export interface Option {
  title: string;
  created: number;
  image: string;
  cost: number;
  description: string;
  category: Category;
}

const createOptions: Option[] = [];

createOptions[Category.Help] = {
  title: "Requests",
  category: Category.Help,
  created: 2,
  image: "string",
  cost: -0.001,
  description: "Give help or offer help.",
};

createOptions[Category.Task] = {
  title: "Tasks",
  category: Category.Task,
  created: 20,
  image: "string",
  cost: 2,
  description: "Tasks get projects and other things done.",
};

createOptions[Category.Journal] = {
  title: "Journal Entry",
  category: Category.Journal,
  created: 8,
  image: "string",
  cost: 5,
  description: "Track and share your progress.",
};

createOptions[Category.Lesson] = {
  title: "Lesson",
  category: Category.Lesson,
  created: 7,
  image: "string",
  cost: 15,
  description: "Teach the world what you know and make it better.",
};

createOptions[Category.Offer] = {
  title: "Offer",
  category: Category.Offer,
  created: 35,
  image: "string",
  cost: 1,
  description: "Teacher Bot is a give and take economy.",
};

createOptions[Category.Invite] = {
  title: "Invite",
  category: Category.Invite,
  created: 50,
  image: "string",
  cost: 20,
  description: "Get people joining what you love.",
};

export default createOptions;
