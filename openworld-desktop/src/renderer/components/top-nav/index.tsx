import React from "react";
import css from "./index.scss";
import { NavLink, useLocation } from "react-router-dom";

interface TopNavItemProps {
  title: string;
  route: string;
}

function TopNavItem(props: TopNavItemProps): JSX.Element {
  const location = useLocation();
  const isActive = location.pathname == props.route;
  return (
    <NavLink exact to={props.route}>
      <div className={`${css.item} ${isActive && css.selected}`}>
        {props.title}
      </div>
    </NavLink>
  );
}

export default function TopNav(): JSX.Element {
  return (
    <div className={css.container}>
      <TopNavItem route="/home" title="Home" />
      <TopNavItem route="/learn" title="Learn" />
      <TopNavItem route="/teach" title="teach" />
      <TopNavItem route="/xr" title="XR" />
    </div>
  );
}
