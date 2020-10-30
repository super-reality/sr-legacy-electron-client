import React from 'react';
import { ReactComponent as ArrowBackIcon } from "../../../../assets/svg/arrow-back.svg";
import { ReactComponent as ArrowForwardIcon } from "../../../../assets/svg/arrow-forward.svg";
import { ReactComponent as NavMinimizeIcon } from "../../../../assets/svg/nav-minimize.svg";
import { ReactComponent as NavMaximizeIcon } from "../../../../assets/svg/nav-maximize.svg";
import { ReactComponent as NavCloseIcon } from "../../../../assets/svg/nav-close.svg";
import "./app-top-navigation.scss";

// window navigation on top of the app
const AppTopNav = (): JSX.Element => {
    return (

        <div className="window-top-navigation"
            style={{
                height: "25px"
            }}
        >
            <button className="window-top-navigation-buttons-left" type="button">
                <ArrowBackIcon className="window-top-navigation-buttons-icons" />
            </button>
            <button type="button" className="window-top-navigation-buttons-left">
                <ArrowForwardIcon className="window-top-navigation-buttons-icons" />
            </button>
            <div className="window-top-navigation-right">
                <button className="window-top-navigation-buttons minimize-button" type="button">
                    <NavMinimizeIcon className="window-top-navigation-buttons-icons minimize" />
                </button>
                <button type="button" className="window-top-navigation-buttons maximize-button">
                    <NavMaximizeIcon className="window-top-navigation-buttons-icons" />
                </button>
                <button type="button" className="window-top-navigation-buttons">
                    <NavCloseIcon className="window-top-navigation-buttons-icons" />
                </button>
            </div>

        </div>

    )
}

export default AppTopNav;