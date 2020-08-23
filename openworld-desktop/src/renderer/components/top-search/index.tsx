import React, { useCallback, useMemo, useState, CSSProperties } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { ReactComponent as SearchIcon } from "../../../assets/svg/search.svg";
import { ReactComponent as BackIcon } from "../../../assets/svg/back.svg";
import { ReactComponent as ProfileIcon } from "../../../assets/svg/profile.svg";
import { AppState } from "../../redux/stores/renderer";
import Flex from "../flex";
import reduxAction from "../../redux/reduxAction";
import ButtonRound from "../button-round";
import playSound from "../../../utils/playSound";
import ButtonSimple from "../button-simple";
import { tabNames } from "../../redux/slices/renderSlice";
import useSelectHeader from "../../hooks/useSelectHeader";
import Category from "../../../types/collections";
import useOutsideClick from "../../hooks/useOutsideClick";

interface TopNavItemProps {
  style?: CSSProperties;
  title: tabNames;
  onClick: () => void;
}

function TopNavItem(props: TopNavItemProps): JSX.Element {
  const { title, onClick, style } = props;

  return (
    <ButtonSimple
      onClick={onClick}
      width="calc(25% - 24px)"
      height="16px"
      style={{
        lineHeight: "16px",
        ...style,
      }}
    >
      {title}
    </ButtonSimple>
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

  const [SelectDropdown, dropdownRef] = useSelectHeader(openDropdown, onSelect);

  const closeDropdown = useCallback(() => {
    if (openDropdown) {
      setOpenDropdown(null);
    }
  }, [openDropdown]);

  useOutsideClick(dropdownRef, closeDropdown);

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
            <div className="top-input-icon">
              <SearchIcon width="16px" height="16px" fill="var(--color-icon)" />
            </div>
          </div>
        </Flex>
        <ButtonRound
          onClick={() => {
            openProfile();
            playSound("./sounds/top-menu.wav");
          }}
          style={{
            backgroundColor:
              location.pathname == "/profile" ? "var(--color-background)" : "",
          }}
          iconFill={
            location.pathname == "/profile" ? "var(--color-text-active)" : ""
          }
          svg={ProfileIcon}
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
            style={{
              backgroundColor:
                openDropdown == b[1] || location.pathname == b[0]
                  ? "var(--color-background)"
                  : "",
              color:
                location.pathname == b[0] ? "var(--color-text-active)" : "",
            }}
            title={b[1]}
          />
        ))}
      </div>
      {openDropdown ? <SelectDropdown /> : <></>}
    </div>
  );
}
