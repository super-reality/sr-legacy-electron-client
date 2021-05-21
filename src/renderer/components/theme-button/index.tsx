// import BaseToggle from "../base-toggle";
import { useState } from "react";
import { ReactComponent as SunIcon } from "../../../assets/svg/sun-icon.svg";
import { ReactComponent as MoonIcon } from "../../../assets/svg/moon-icon.svg";

import "./index.scss";
import ButtonRound from "../button-round";

export default function ThemeSlider() {
  const [icon, setIcon] = useState("dark");
  // change theme function

  const toggleTheme = () => {
    const theme = document.documentElement.getAttribute("data-theme");
    console.log(theme);
    if (theme === "light") {
      setIcon("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setIcon("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  };

  return (
    <div className="theme-button">
      <ButtonRound
        height="20px"
        width="20px"
        svg={icon === "dark" ? SunIcon : MoonIcon}
        iconFill="yellow"
        style={{ borderRadius: "50%" }}
        svgStyle={{ width: "20px", height: "20px" }}
        onClick={toggleTheme}
      />
    </div>
  );
}
// <BaseToggle title="" value callback={toggleTheme} />
