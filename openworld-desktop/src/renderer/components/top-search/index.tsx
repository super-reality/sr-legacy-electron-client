import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { useSpring, animated } from "react-spring";
import { useLocation, useHistory } from "react-router-dom";
import { ReactComponent as SearchIcon } from "../../../assets/svg/search.svg";
import { ReactComponent as BackIcon } from "../../../assets/svg/back.svg";
import { ReactComponent as CreateIcon } from "../../../assets/svg/create.svg";
import Select from "../select";
import { AppState } from "../../redux/stores/renderer";
import Flex from "../flex";
import reduxAction from "../../redux/reduxAction";
import Category from "../../../types/collections";
import ButtonRound from "../button-round";
import usePopupCreate from "../../hooks/usePopupCreate";

const selectOptionsByTab: Record<string, Record<string, Category | string>> = {
  "/discover": {
    "Discover All": Category.All,
    Lessons: Category.Lesson,
    Subjects: Category.Subject,
    Collections: Category.Collection,
    Organizations: Category.Organization,
    Teachers: Category.Teacher,
    Students: Category.Student,
    Projects: Category.Project,
    Tasks: Category.Task,
    Resources: Category.Resource,
    Portfolios: Category.Portfolio,
  },
  "/learn": {
    "All Interests": Category.All,
    "Active Lessons": Category.Lesson,
    "Active Subjects": Category.Subject,
    "Active Collections": Category.Collection,
    "Active Organizations": Category.Organization,
    "Active Resources": Category.Resource,
    "Active Tasks": Category.Task,
    "My Teachers": Category.Teacher,
  },
  "/teach": {
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
  "/me": {
    "My Profile": "profile",
    "My Score": "score",
    "My Portfolio": "portfolio",
    "My Account": "account",
    "My Events": "events",
    "My Info": "info",
  },
};

export default function TopSearch(): JSX.Element {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  // Select
  const currentOptions = selectOptionsByTab[location.pathname];
  const showSelect = !!currentOptions;

  const topSelectStates = useSelector(
    (state: AppState) => state.render.topSelectStates
  );

  const currentSelected = useMemo(
    () =>
      topSelectStates[location.pathname] ||
      (selectOptionsByTab[location.pathname]
        ? Object.values(selectOptionsByTab[location.pathname])[0]
        : Category.All),
    [topSelectStates, location]
  );

  const setCurrentSelected = useCallback(
    (selected: Category | string) => {
      reduxAction(dispatch, {
        type: "SET_TOP_SELECT",
        arg: { selected, path: location.pathname },
      });
    },
    [dispatch, location]
  );

  // Input
  const topInputStates = useSelector(
    (state: AppState) => state.render.topInputStates
  );

  const currentInputValue = useMemo(
    () => topInputStates[location.pathname] || "",
    [topInputStates, location]
  );

  const onInputchange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const str = event.currentTarget.value;
      reduxAction(dispatch, {
        type: "SET_TOP_INPUT",
        arg: { str, path: location.pathname },
      });
    },
    [dispatch, location]
  );

  // Hide/show animation
  const offset = 40;
  const { yScroll, yScrollDelta } = useSelector(
    (state: AppState) => state.render
  );
  const [yPos, setYPos] = useState(offset);

  useEffect(() => {
    if (yScrollDelta > 0) {
      setYPos(offset);
    } else if (yPos + offset < yScroll) {
      setYPos(Math.max(-12, -yScroll + offset));
    }
  }, [yPos, yScrollDelta, yScroll]);

  const spring = useSpring({ top: `${yPos}px` });

  // Create button
  const [CreatePopup, openCreate] = usePopupCreate();

  return (
    <>
      <CreatePopup />
      <animated.div
        style={spring}
        className={`top-controls ${!showSelect ? "no-select" : ""}`}
      >
        <ButtonRound
          onClick={history.goBack}
          svg={BackIcon}
          style={{ margin: "auto" }}
          height="32px"
          width="32px"
        />
        <Flex>
          <div className="top-input-container">
            <input
              className="top-input"
              onChange={onInputchange}
              value={currentInputValue}
            />
            <div className="top-inpu-icon">
              <SearchIcon width="20px" height="20px" fill="var(--color-text)" />
            </div>
          </div>
        </Flex>
        {currentOptions ? (
          <Select<Category | string>
            style={{ width: "auto" }}
            current={currentSelected}
            callback={setCurrentSelected}
            optionFormatter={(arg: Category | string) =>
              Object.keys(currentOptions).filter(
                (c) => currentOptions[c] == arg
              )[0] || ""
            }
            options={Object.values(currentOptions)}
          />
        ) : (
          <></>
        )}
        <ButtonRound
          onClick={openCreate}
          svg={CreateIcon}
          style={{ margin: "auto" }}
          height="32px"
          width="32px"
        />
      </animated.div>
    </>
  );
}
