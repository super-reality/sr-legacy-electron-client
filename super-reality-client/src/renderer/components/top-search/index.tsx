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
import { ReactComponent as SearchIcon } from "../../../assets/svg/search-new.svg";
import { ReactComponent as SearchDrop } from "../../../assets/svg/tree-drop.svg";
import { ReactComponent as SearchPlusIcon } from "../../../assets/svg/plus.svg";

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
import { TopTabs, TopTabsContainer } from "../top-panel/top-tabs";
import {
  ContainerFlex,
  Image,
  ItemInner,
  Title,
  Text,
  ContainerTop,
} from "../item-inner";
import ContainerBasic from "../base/base-container";
import { ItemImage } from "../collection-new/collection-all";


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

  enum TestTopEnum {
    SuperReality,
    MyReality,
  }
  type Sections = "Super Reality" | "My Reality";
  const sections: Sections[] = ["Super Reality", "My Reality"];
  const [view, setView] = useState<Sections>(sections[0]);

  //

  return (
    <ContainerTop>
      <ContainerFlex style={{ display: "flex", flexDirection: "row" }}>
        <TopTabs
          buttons={sections}
          initial={view}
          width="-webkit-fill-available"
          height="auto"
          style={{ width: "65vw", fontSize: "15px" }}
          callback={(str: string): void => {
            console.log(str);
          }}
        />
        <TeacherBotTop />
      </ContainerFlex>

      <TopTabsContainer
        style={{
          margin: "0",
          padding: "0",
          borderTop: "none",
        }}
      >
        <ContainerFlex style={{ padding: "0.1em 0.25em", display: "flex" }}>
          <div className="top-input-container">
            <div className="top-input-icon">
              <SearchIcon width="12px" height="12px" fill="var(--color-icon)" />
            </div>
            <div className="top-input-icon-drop-down">
              <SearchDrop width="8px" height="16px" fill="var(--color-icon)" />
            </div>

            <input
              className="top-input"
              onChange={onInputchange}
              value={currentInputValue}
            />
          </div>
          <div className="top-input-icon-plus">
            <SearchPlusIcon
              width="10px"
              height="10px"
              fill="var(--color-icon)"
            />
          </div>
          <div className="top-input-icon-drop-down">
            <SearchDrop width="8px" height="10px" fill="var(--color-icon)" />
          </div>
        </ContainerFlex>
        <ContainerFlex
          style={{
            backgroundColor: " var(--color-background)",
            display: "flex",
            width: "150%",
          }}
        >
          {["Featured - Super Reality Teacher", "VR Game Developer"].map(
            (item: string): JSX.Element => {
              return (
                <ItemInner
                  key={item}
                  style={{
                    backgroundColor: "inherit",
                    margin: "0 0.1rem",
                    padding: "0",
                  }}
                >
                  <ContainerBasic className="top-image-container">
                    <Image
                      style={{ borderRadius: "0" }}
                      src="https://img.freepik.com/free-vector/synthwave-night-city-background_126980-167.jpg?size=626&ext=jpg"
                    />
                  </ContainerBasic>
                  <ContainerFlex>
                    <Text
                      style={{
                        color: "var(--color-blue)",
                        margin: "0 0 1rem 1rem",
                        fontSize: "16px",
                      }}
                    >
                      {item}
                    </Text>
                  </ContainerFlex>
                </ItemInner>
              );
            }
          )}
        </ContainerFlex>
      </TopTabsContainer>
    </ContainerTop>
  );
}

/*
<ItemInner style={{ backgroundColor: "inherit", margin: "0 0.1rem", padding: "0" }}>
            <ContainerBasic className="top-image-container">
              <Image style={{ borderRadius: "0" }}
                src="https://img.freepik.com/free-vector/synthwave-night-city-background_126980-167.jpg?size=626&ext=jpg"
              />
            </ContainerBasic>
            <ContainerFlex>
              <Text style={{ color: "var(--color-blue)", margin: "0 0 1rem 1rem", fontSize: "16px" }}>
                VR Game Developer
                </Text>
            </ContainerFlex>
          </ItemInner>
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
*/
