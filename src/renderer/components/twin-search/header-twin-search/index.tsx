import { useEffect, useState } from "react";
import { animated, useSpring } from "react-spring/web";

// import { ReactComponent as DefaultUser } from "../../../../assets/svg/default-user.svg";
import { ReactComponent as Logo } from "../../../../assets/svg/logo.svg";
import { ReactComponent as PlusIcon } from "../../../../assets/svg/plus-icon.svg";
// import { ReactComponent as PlanetIcon } from "../../../../assets/svg/big-planet-icon.svg";
// import PlanetIconPng from "../../../../assets/images/big-planet-icon.png";

// import { voidFunction } from "../../../constants";
import ButtonRound from "../../button-round";
import TwinSearchInput from "./search-input";
import { onTextChange } from "../../../../utils/chat-utils/common-functions";
import CreateCollectiveAi from "../create-collective-form";

interface HeaderTwinSearchProps {
  startSearch: (value: string) => void;
  handleEnterDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: string
  ) => void;
  rollUp: boolean;
}

export default function HeaderTwinSearch(props: HeaderTwinSearchProps) {
  const { startSearch, handleEnterDown, rollUp } = props;
  const [searchString, setSearchString] = useState("");

  const [headerLeftProps, apiHeader] = useSpring(
    {
      height: "82vh",
      margin: "3em 0 0 0",
    } as any,
    [rollUp]
  );
  const [searchContainerProps, apiContainer] = useSpring(
    {
      flexDirection: "column",
      width: "50%",
      margin: "0 0 0 0",
      padding: "0 0 0 0",
    } as any,
    [rollUp]
  );

  const [logoProps, apiLogo] = useSpring(
    {
      height: "20vh",
      width: "9vw",
    } as any,
    [rollUp]
  );

  const [logoTextProps, apiLogoText] = useSpring(
    {
      fontSize: "2.2em",
      fontWeight: "700",
      margin: "0 0 0.8em 0",
    } as any,
    [rollUp]
  );

  //   const [searchWProps, apiContainer] = useSpring(
  //     {
  //       flexDirection: "column",
  //       width: "50%",
  //     } as any,
  //     [rollUp]
  //   );

  useEffect(() => {
    if (rollUp) {
      apiContainer.start({
        flexDirection: "row",
        width: "90%",
        margin: "0 0 0 6em",
        padding: "0 2em 0 0",
      });
      apiHeader.start({
        height: "7vh",
        margin: "0 0 0 0",
      });
      apiLogo.start({
        width: "3vw",
        height: "7vh",
      });
      apiLogoText.start({
        fontSize: "1.3em",
        fontWeight: "700",
        margin: "0 2em 0 0.5em",
      });
    }
  }, [rollUp]);

  // create form popup
  const [CreateCAi, open] = CreateCollectiveAi();

  return (
    <div className="twin-search-header">
      <CreateCAi />
      <animated.div className="twin-search-header-left" style={headerLeftProps}>
        <animated.div className="search-container" style={searchContainerProps}>
          <animated.div className="logo" style={logoProps}>
            <Logo width="100%" height="100%" />
          </animated.div>

          <animated.div className="logo-text" style={logoTextProps}>
            <div className="super">Super</div>
            <div className="reality">Reality</div>
          </animated.div>
          <TwinSearchInput
            onChange={(e) => {
              onTextChange(e, setSearchString);
            }}
            onKeyUp={(e) => {
              handleEnterDown(e, searchString);
            }}
            onClick={() => startSearch(searchString)}
            value={searchString}
          />
          {!rollUp && (
            <div className="header-left-footer">
              {/* <img src={PlanetIconPng} alt="" /> */}
              <div className="header-left-footer-info">
                Collective Intelligence - Metaverse - Open Source - Non Profit -
                Decentralized
              </div>
            </div>
          )}
        </animated.div>
        <ButtonRound
          height="40px"
          width="40px"
          svg={PlusIcon}
          style={{
            backgroundColor: "inherit",
            position: "absolute",
            right: "75px",
            top: "75px",
          }}
          svgStyle={{
            fill: "var(--color-text)",
            width: "inherit",
            height: "inherit",
          }}
          onClick={open}
        />
      </animated.div>
    </div>
  );
}

/*

<div className="twin-search-header-right">
        <div className="language">En</div>
        <div className="logged-user">
          <div className="name-container">UserName</div>
          <div className="avatar-container">
            <ButtonRound
              onClick={voidFunction}
              width="40px"
              height="40px"
              svg={DefaultUser}
              style={{ borderRadius: "50%" }}
            />
          </div>
        </div>
        
        <div className="menu">
          <Menu width="20xp" height="20px" />
        </div>
      </div>

*/
