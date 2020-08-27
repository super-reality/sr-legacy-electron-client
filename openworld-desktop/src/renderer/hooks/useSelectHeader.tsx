import React, { useRef } from "react";
import "./index.scss";
import { useRouteMatch } from "react-router-dom";
import { useWindowSize } from "react-use";
import { useSelector } from "react-redux";
import Category from "../../types/collections";
import { tabNames } from "../redux/slices/renderSlice";
import { AppState } from "../redux/stores/renderer";
import useOutsideClick from "./useOutsideClick";

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
};

export default function useSelectHeader(
  title: tabNames | null,
  onSelect: (route: string, selected: string | Category) => void
): [() => JSX.Element, React.MutableRefObject<HTMLDivElement | null>] {
  const ref = useRef<HTMLDivElement | null>(null);

  const mainMatch = useRouteMatch<{
    any: string;
    category: string;
  }>("/:any");

  const catMatch = useRouteMatch<{
    any: string;
    category: string;
  }>("/:any/:category");

  const { width } = useWindowSize();

  const leftOffset = 16;
  const buttonSize = (width - leftOffset - leftOffset) / 4 - 24 + 16;
  const centers: Record<tabNames, number> = {
    Discover: 16 + 8 * 0 + buttonSize * 0.5,
    Learn: 16 + 8 * 1 + buttonSize * 1.5,
    Teach: 16 + 8 * 2 + buttonSize * 2.5,
    Create: 16 + 8 * 3 + buttonSize * 3.5,
  };

  const titleToRoute: Record<tabNames, string> = {
    Discover: "discover",
    Learn: "learn",
    Teach: "teach",
    Create: "create",
  };

  if (title) {
    const left = Math.min(Math.max(8, centers[title] - 104), width - 208 - 8);
    const currentOptions = selectOptionsByTab[title];
    const Dropdown = () => (
      <div
        ref={ref}
        className="dropdown-container"
        style={{ left: `${left}px` }}
      >
        {Object.keys(currentOptions).map((option) => {
          const active =
            `${currentOptions[option]}` == catMatch?.params.category &&
            mainMatch?.params.any == titleToRoute[title];
          return (
            <div
              className="option"
              key={`option-${option}`}
              onClick={() => {
                onSelect(titleToRoute[title], currentOptions[option]);
              }}
              style={{
                color: active ? "var(--color-text-active)" : "",
              }}
            >
              {option}
            </div>
          );
        })}
      </div>
    );
    return [Dropdown, ref];
  }

  return [() => <></>, ref];
}
