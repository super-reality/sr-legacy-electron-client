import Category from "../../../types/collections";
import CatCollection from "../../../assets/images/cat-collection.png";
import CatLesson from "../../../assets/images/cat-lesson.png";
import CatOffer from "../../../assets/images/cat-offer.png";
import CatSubject from "../../../assets/images/cat-subject.png";

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

createOptions[Category.Collection] = {
  title: "Collection",
  category: Category.Collection,
  created: 1,
  image: CatCollection,
  cost: -10,
  description: "Collections contain subjects.",
};

createOptions[Category.Subject] = {
  title: "Subject",
  category: Category.Subject,
  created: 1,
  image: CatSubject,
  cost: -5,
  description: "Subjects contain lessons.",
};

createOptions[Category.Lesson] = {
  title: "Lesson",
  category: Category.Lesson,
  created: 7,
  image: CatLesson,
  cost: 15,
  description: "Teach the world what you know and make it better.",
};

createOptions[Category.Offer] = {
  title: "Offer",
  category: Category.Offer,
  created: 35,
  image: CatOffer,
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
