import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { useSpring, animated } from "react-spring";
import { useLocation } from "react-router-dom";
import { ReactComponent as SearchIcon } from "../../../assets/svg/search.svg";
import { ReactComponent as BackIcon } from "../../../assets/svg/back.svg";
import { ReactComponent as AlertIcon } from "../../../assets/svg/alert.svg";
import Select from "../select";
import { AppState } from "../../redux/stores/renderer";
import Flex from "../flex";
import reduxAction from "../../redux/reduxAction";
import Category from "../../../types/collections";

const selectOptionsByTab: Record<string, Record<string, Category>> = {
  "/find": {
    All: Category.All,
    Subjects: Category.Subject,
    Organization: Category.Organization,
    Collection: Category.Collection,
    Teachers: Category.Teacher,
    Student: Category.Student,
    Wanted: Category.Want,
    "Teacher Bot": Category.TeacherBot,
  },
  "/learn": {
    "All My Stuff": Category.All,
    "My Lessons": Category.Lesson,
    "My Subjects": Category.Subject,
    "My Organizations": Category.Organization,
    "My Collections": Category.Collection,
    "My Teachers": Category.Teacher,
    "My Classmates": Category.Student,
    "My Teacher Bot": Category.TeacherBot,
  },
};

export default function TopSearch(): JSX.Element {
  const dispatch = useDispatch();
  const location = useLocation();

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
    (selected: Category) => {
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

  return (
    <animated.div
      style={spring}
      className={`top-controls ${!showSelect ? "no-select" : ""}`}
    >
      <BackIcon
        style={{ margin: "auto" }}
        width="42px"
        fill="var(--color-section)"
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
        <Select<Category>
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
      <AlertIcon
        style={{ margin: "auto" }}
        width="42px"
        fill="var(--color-section)"
      />
    </animated.div>
  );
}
