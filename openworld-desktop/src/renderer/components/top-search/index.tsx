import React, {
  useCallback,
  useMemo,
  useState,
  CSSProperties,
  useRef,
} from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory, useRouteMatch } from "react-router-dom";
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
import TeacherBotTop from "../teacherbot-top";

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
  const history = useHistory();
  const dropdownContainerRef = useRef<HTMLDivElement | null>(null);

  const topNavButtons: Array<[string, tabNames]> = [
    // ["test", "Test"],
    ["discover", "Discover"],
    ["learn", "Learn"],
    ["teach", "Teach"],
    ["create", "Create"],
  ];

  const mainMatch = useRouteMatch<{
    any: string;
    categorgy: string;
  }>("/:any");

  const catMatch = useRouteMatch<{
    any: string;
    categorgy: string;
  }>("/:any/:categorgy");

  // Input
  const topInputStates = useSelector(
    (state: AppState) => state.render.topInputStates
  );

  const currentInputValue = useMemo(
    () => topInputStates[mainMatch?.params.any || ""] || "",
    [topInputStates, mainMatch]
  );

  const onInputchange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const str = event.currentTarget.value;
      reduxAction(dispatch, {
        type: "SET_TOP_INPUT",
        arg: { str, path: mainMatch?.params.any || "" },
      });
    },
    [dispatch, mainMatch]
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
    (route: string, selected: string | Category) => {
      console.log(route, selected);
      if (openDropdown) {
        history.push(`/${route}/${selected}`);
        setOpenDropdown(null);
      }
    },
    [openDropdown]
  );

  const [SelectDropdown, dropdownRef] = useSelectHeader(
    openDropdown,
    onSelect,
    dropdownContainerRef
  );

  const closeDropdown = useCallback(() => {
    if (openDropdown) {
      setOpenDropdown(null);
    }
  }, [openDropdown]);

  useOutsideClick(dropdownRef, closeDropdown);

  return (
    <div className="top-search-container">
      <div className="title" />
      <div className="top">
        <ButtonRound
          onClick={backClick}
          svg={BackIcon}
          height="24px"
          width="24px"
          style={{ margin: "auto" }}
        />
        <Flex>
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
        <TeacherBotTop />
        <ButtonRound
          onClick={() => {
            openProfile();
            playSound("./sounds/top-menu.wav");
          }}
          style={{
            margin: "auto",
            backgroundColor:
              mainMatch?.params.any == "profile"
                ? "var(--color-background)"
                : "",
          }}
          iconFill={
            mainMatch?.params.any == "profile" ? "var(--color-text-active)" : ""
          }
          svg={ProfileIcon}
          height="24px"
          width="24px"
        />
      </div>
      <div className="bottom" ref={dropdownContainerRef}>
        {topNavButtons.map((b) => (
          <TopNavItem
            onClick={() => {
              setOpenDropdown(openDropdown !== b[1] ? b[1] : null);
              playSound("./sounds/top-menu.wav");
            }}
            key={b[0]}
            style={{
              backgroundColor:
                openDropdown == b[1] || mainMatch?.params.any == b[0]
                  ? "var(--color-background)"
                  : "",
              color:
                mainMatch?.params.any == b[0] ? "var(--color-text-active)" : "",
            }}
            title={b[1]}
          />
        ))}
      </div>
      {openDropdown ? <SelectDropdown /> : <></>}
    </div>
  );
}
