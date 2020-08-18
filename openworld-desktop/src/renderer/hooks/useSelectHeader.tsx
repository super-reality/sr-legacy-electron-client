import React from "react";
import "./index.scss";
import { useLocation } from "react-router-dom";
import Category from "../../types/collections";
import { tabNames } from "../redux/slices/renderSlice";

const selectOptionsByTab: Record<
  tabNames,
  Record<string, Category | string>
> = {
  Discover: {
    "Discover All": Category.All,
    Lessons: Category.Lesson,
    Subjects: Category.Subject,
    Collections: Category.Collection,
    Organizations: Category.Organization,
    Users: Category.User,
    Students: Category.Student,
    Projects: Category.Project,
    Tasks: Category.Task,
    Resources: Category.Resource,
    Help: Category.Help,
  },
  Learn: {
    All: Category.All,
    "Active Lessons": Category.Lesson,
    "Active Subjects": Category.Subject,
    "Active Collections": Category.Collection,
    "Active Organizations": Category.Organization,
    "Active Users": Category.User,
    "Active Projects": Category.Project,
    "Active Tasks": Category.Task,
    "Active Resources": Category.Resource,
    "Active Help": Category.Help,
  },
  Teach: {
    "All Duties": Category.All,
    "My Lessons": Category.Lesson,
    "My Subjects": Category.Subject,
    "My Collections": Category.Collection,
    "My Organizations": Category.Organization,
    "My Projects": Category.Resource,
    "My Resources": Category.Resource,
    "My Tasks": Category.Task,
    "My Students": Category.Student,
  },
  Create: {
    "Create Anything": Category.All,
    "Create Project": Category.Project,
    "Create Collection": Category.Collection,
    "Create Lesson": Category.Lesson,
    "Create Portfolio Piece": Category.Portfolio,
    "Create Resource": Category.Resource,
    "Create Organization": Category.Organization,
  },
  Profile: {
    Me: "me",
    "My Lessons": "my lessons",
  },
};

export default function useSelectHeader(
  title: tabNames | null,
  onSelect: (selected: string | Category, route: string) => void
): [() => JSX.Element] {
  const location = useLocation();

  const titleToRoute: Record<tabNames, string> = {
    Discover: "/discover",
    Learn: "/learn",
    Teach: "/teach",
    Create: "/create",
    Profile: "/profile",
  };

  if (title) {
    const currentOptions = selectOptionsByTab[title];
    const Dropdown = () => (
      <div className="dropdown-container">
        {Object.keys(currentOptions).map((option) => {
          return (
            <div
              className="option"
              key={`option-${option}`}
              onClick={() => {
                onSelect(currentOptions[option], titleToRoute[title]);
              }}
            >
              {option}
            </div>
          );
        })}
      </div>
    );
    return [Dropdown];
  }

  return [() => <></>];
}
