import React, { useCallback, useMemo, useState } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory, NavLink } from "react-router-dom";
import { ReactComponent as SearchIcon } from "../../../assets/svg/search.svg";
import { ReactComponent as BackIcon } from "../../../assets/svg/back.svg";
import { ReactComponent as CreateIcon } from "../../../assets/svg/create.svg";
import { AppState } from "../../redux/stores/renderer";
import Flex from "../flex";
import reduxAction from "../../redux/reduxAction";
import ButtonRound from "../button-round";
import playSound from "../../../utils/playSound";
import ButtonSimple from "../button-simple";
import { tabNames } from "../../redux/slices/renderSlice";
import useSelectHeader from "../../hooks/useSelectHeader";
import Category from "../../../types/collections";

interface TopNavItemProps {
  title: tabNames;
  route: string;
  onClick: () => void;
}

function TopNavItem(props: TopNavItemProps): JSX.Element {
  const { route, title, onClick } = props;
  const location = useLocation();
  const isActive = location.pathname === route;

  return (
    <>
      <ButtonSimple
        onClick={onClick}
        width="calc(25% - 20px)"
        height="16px"
        style={{
          color: isActive ? "var(--color-text-active)" : "",
          backgroundColor: isActive ? "var(--color-background)" : "",
          lineHeight: "16px",
        }}
      >
        {title}
      </ButtonSimple>
    </>
  );
}

export default function TopSearch(): JSX.Element {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const topNavButtons: Array<[string, tabNames]> = [
    // ["/test", "Test"],
    ["/discover", "Discover"],
    ["/learn", "Learn"],
    ["/teach", "Teach"],
    ["/create", "Create"],
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

  const openProfile = () => {
    history.push("/profile");
  };

  // Dropdowns
  const [openDropdown, setOpenDropdown] = useState<tabNames | null>(null);

  const onSelect = useCallback(
    (selected: string | Category, route: string) => {
      if (openDropdown) {
        history.push(route);
        reduxAction(dispatch, {
          type: "SET_TOP_SELECT",
          arg: { selected, path: openDropdown },
        });
        setOpenDropdown(null);
      }
    },
    [openDropdown]
  );

  const [SelectDropdown] = useSelectHeader(openDropdown, onSelect);

  return (
    <div className="top-search-container">
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
          onClick={openProfile}
          svg={CreateIcon}
          height="24px"
          width="24px"
        />
      </div>
      <div className="bottom">
        {topNavButtons.map((b) => (
          <TopNavItem
            onClick={() => {
              setOpenDropdown(openDropdown !== b[1] ? b[1] : null);
              playSound("./sounds/top-menu.wav");
            }}
            key={b[0]}
            route={openDropdown == b[1] ? location.pathname : b[0]}
            title={b[1]}
          />
        ))}
      </div>
      {openDropdown ? <SelectDropdown /> : <></>}
    </div>
  );
}
