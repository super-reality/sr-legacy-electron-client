import React, { useState, useEffect, useCallback, useMemo } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { useSpring, animated } from "react-spring";
import { useLocation, useHistory, NavLink } from "react-router-dom";
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
import playSound from "../../../utils/playSound";
import ButtonSimple from "../button-simple";

interface TopNavItemProps {
  title: string;
  route: string;
}

function TopNavItem(props: TopNavItemProps): JSX.Element {
  const { route, title } = props;
  const location = useLocation();
  const isActive = location.pathname === route;
  return (
    <NavLink exact to={route} style={{ width: "calc(25% - 4px)" }}>
      <ButtonSimple
        onClick={() => {
          playSound("./sounds/top-menu.wav");
        }}
        height="16px"
        style={{
          color: isActive ? "var(--color-text-active)" : "",
          lineHeight: "16px",
        }}
      >
        {title}
      </ButtonSimple>
    </NavLink>
  );
}

export default function TopSearch(): JSX.Element {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const topNavButtons: string[][] = [
    // ["/test", "Test"],
    ["/discover", "Discover"],
    ["/learn", "Learn"],
    ["/teach", "Teach"],
    ["/me", "100"],
  ];

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

  const backClick = useCallback(() => {
    playSound("./sounds/back-button.wav");
    history.goBack();
  }, []);

  // Create button
  const [CreatePopup, openCreate] = usePopupCreate();
  return (
    <div className="top-search-container">
      <CreatePopup />
      <div className="top">
        <ButtonRound
          onClick={backClick}
          svg={BackIcon}
          height="24px"
          width="24px"
        />
        <Flex style={{ width: "calc(100% - 64px)" }}>
          <div className="top-input-container">
            <input
              className="top-input"
              onChange={onInputchange}
              value={currentInputValue}
            />
            <div className="top-inpu-icon">
              <SearchIcon width="16px" height="16px" fill="var(--color-icon)" />
            </div>
          </div>
        </Flex>
        <ButtonRound
          onClick={openCreate}
          svg={CreateIcon}
          height="24px"
          width="24px"
        />
      </div>
      <div className="bottom">
        {topNavButtons.map((b) => (
          <TopNavItem key={b[0]} route={b[0]} title={b[1]} />
        ))}
      </div>
    </div>
  );
}
