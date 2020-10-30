import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as ArrowBackIcon } from "../../../../assets/svg/arrow-back.svg";
import { ReactComponent as ArrowForwardIcon } from "../../../../assets/svg/arrow-forward.svg";
import { ReactComponent as NavMinimizeIcon } from "../../../../assets/svg/nav-minimize.svg";
import { ReactComponent as NavMaximizeIcon } from "../../../../assets/svg/nav-maximize.svg";
import { ReactComponent as NavCloseIcon } from "../../../../assets/svg/nav-close.svg";
import playSound from "../../../../utils/playSound";
import "./app-top-navigation.scss";

// window navigation on top of the app
const AppTopNav = (): JSX.Element => {
  const history = useHistory();
  const { remote } = window.require("electron");

  // functions to navigate at the main app window
  // to go back to the previos window in the app history
  const goBackClick = useCallback(() => {
    playSound("./sounds/back-button.wav");
    history.goBack();
  }, []);

  // to go forward to the next window in the app history
  const goForvardClick = useCallback((): void => {
    playSound("./sounds/forward-button.wav");
    history.goForward();
  }, []);

  // to minimize the main window
  const minimizeWindow = (): void => {
    const WIN = remote.getCurrentWindow();
    WIN.minimize();
  };

  // to maximize the main window
  const maximizeWindow = (): void => {
    const WIN = remote.getCurrentWindow();
    if (!WIN.isMaximized()) {
      WIN.maximize();
    } else {
      WIN.unmaximize();
    }
  };
  // to close the main window
  const closeWindow = (): void => {
    const WIN = remote.getCurrentWindow();
    WIN.close();
  };

  return (
    <div
      className="window-top-navigation"
      style={{
        height: "25px",
      }}
    >
      <button
        type="button"
        onClick={goBackClick}
        className="window-top-navigation-buttons buttons-left"
      >
        <ArrowBackIcon className="window-top-navigation-buttons-icons" />
      </button>
      <button
        type="button"
        onClick={goForvardClick}
        className="window-top-navigation-buttons buttons-left"
      >
        <ArrowForwardIcon className="window-top-navigation-buttons-icons" />
      </button>
      <div className="window-top-navigation-right">
        <button
          type="button"
          onClick={minimizeWindow}
          className="window-top-navigation-buttons minimize-button"
        >
          <NavMinimizeIcon className="window-top-navigation-buttons-icons minimize" />
        </button>
        <button
          type="button"
          onClick={maximizeWindow}
          className="window-top-navigation-buttons maximize-button"
        >
          <NavMaximizeIcon className="window-top-navigation-buttons-icons" />
        </button>
        <button
          type="button"
          onClick={closeWindow}
          className="window-top-navigation-buttons"
        >
          <NavCloseIcon className="window-top-navigation-buttons-icons" />
        </button>
      </div>
    </div>
  );
};

export default AppTopNav;
