import { useState } from "react";
import { useHistory } from "react-router-dom";

import Windowlet from "../windowlet";
import HeaderTwinSearch from "./header-twin-search";
import SearchCategories from "./SearchCategories";
import "./index.scss";
import TwinSearchMain from "./main-container";
import getPrimaryMonitor from "../../../utils/electron/getPrimaryMonitor";

export default function TwinSearchWindow() {
  const history = useHistory();
  const [category, setCategory] = useState("Web");
  const [rollUp, setRollUp] = useState(false);

  // TODO set Windowlet size in percent for responzive layout
  const display = getPrimaryMonitor();
  const primarySize = display.workArea;
  console.log(primarySize.width);

  const startSearch = (value: string) => {
    setRollUp(!rollUp);
    console.log("startSearch", value);
  };
  const handleEnterDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string
  ) => {
    if (e.key === "Enter") {
      startSearch(value);
    }
  };
  return (
    <Windowlet
      width={1404}
      height={814}
      initialLeft="0"
      initialTop="0"
      title="Digital Twin Search"
      //   onMinimize={minimizeWindow}
      onClose={() => history.push("/")}
    >
      <div className="twin-search-window">
        <HeaderTwinSearch
          startSearch={startSearch}
          handleEnterDown={handleEnterDown}
          rollUp={rollUp}
        />
        {rollUp && (
          <>
            <SearchCategories
              activeId={category}
              onClick={(newCategory: string) => {
                setCategory(newCategory);
                console.log("search category", newCategory);
              }}
            />
            <TwinSearchMain />
            <div className="twin-search-footer">footer</div>
          </>
        )}
      </div>
    </Windowlet>
  );
}

/*
<div className="logged-user">
          <div className="avatar-container">
            <ButtonRound
              onClick={voidFunction}
              width="40px"
              height="40px"
              svg={DefaultUser}
            />
            {{user && user.avatar ? (
                <div className="button-round ">
                  <img
                    className="rounded-img"
                    src={user.avatar}
                    width="40px"
                    height="40px"
                    alt=""
                  />
                </div>
              ) : (
                <ButtonRound
                  onClick={voidFunction}
                  width="40px"
                  height="40px"
                  svg={DefaultUser}
                />
              )}}
          </div>
          <div className="name-container">
            <animated.div style={userNameProps[0]} className="user-name">
                {user && user.username}
              </animated.div>
              <ThemeSlider />
              <GearIcon width="30%" height="30%" fill="var(--color-text)" />
            User Name
          </div>
        </div>
        */
