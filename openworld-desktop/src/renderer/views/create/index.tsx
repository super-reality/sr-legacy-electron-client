import React from "react";
import "./index.scss";
import "../../components/containers.scss";
import { useSelector } from "react-redux";
import Category from "../../../types/collections";
import { AppState } from "../../redux/stores/renderer";
import CreateLesson from "../../components/create-lesson";
import CreateOption from "../../components/create-option";

interface Option {
  title: string;
  created: number;
  image: string;
  cost: number;
  description: string;
  category: Category;
}

const options: Option[] = [
  {
    title: "Requests",
    category: Category.Help,
    created: 2,
    image: "string",
    cost: -0.001,
    description: "Give help or offer help.",
  },
  {
    title: "Tasks",
    category: Category.Task,
    created: 20,
    image: "string",
    cost: 2,
    description: "Tasks get projects and other things done.",
  },
  {
    title: "Journal Entry",
    category: Category.Journal,
    created: 8,
    image: "string",
    cost: 5,
    description: "Track and share your progress.",
  },
  {
    title: "Lesson",
    category: Category.Lesson,
    created: 7,
    image: "string",
    cost: 15,
    description: "Teach the world what you know and make it better.",
  },
  {
    title: "Offer",
    category: Category.Offer,
    created: 35,
    image: "string",
    cost: 1,
    description: "Teacher Bot is a give and take economy.",
  },
  {
    title: "Invite",
    category: Category.Invite,
    created: 50,
    image: "string",
    cost: 20,
    description: "Get people joining what you love.",
  },
];

export default function Create(): JSX.Element {
  const topSelectStates = useSelector(
    (state: AppState) => state.render.topSelectStates
  );
  const current = topSelectStates.Create as Category;

  return (
    <>
      {current == Category.All ? (
        options.map((option) => (
          <CreateOption key={option.title} data={option} />
        ))
      ) : (
        <></>
      )}
      {current == Category.Lesson ? <CreateLesson /> : <></>}
    </>
  );
}
