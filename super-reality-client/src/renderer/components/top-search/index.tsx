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
import isElectron from "../../../utils/isElectron";
import { Tabs, TabsContainer } from "../tabs";
import { ContainerFlex, Image } from "../item-inner";

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

  // 

  return (
    <div className="">
      
      <div className="top">
        <ContainerFlex style={{display:"flex", flexDirection:"row"}}>
        <Tabs
          buttons={["Super Reality", "My Reality"]}
          initial="Super Reality"
          style={{}}
          callback={(str:string): void=>{console.log(str)}}
        />
        <TeacherBotTop />
        </ContainerFlex>
        
          <TabsContainer>
            <ContainerFlex>
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
            </ContainerFlex>
            <ContainerFlex>
              <Image
              src="https://img.freepik.com/free-vector/synthwave-night-city-background_126980-167.jpg?size=626&ext=jpg"
              />
            </ContainerFlex>
          </TabsContainer>
       
      </div>


    </div>
  );
}

/*
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