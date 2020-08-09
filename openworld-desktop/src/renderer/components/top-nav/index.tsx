import React from "react";
import "./index.scss";
import { NavLink, useLocation } from "react-router-dom";

interface TopNavItemProps {
  title: string;
  route: string;
}

function TopNavItem(props: TopNavItemProps): JSX.Element {
  const location = useLocation();
  const isActive = location.pathname === props.route;
  return (
    <NavLink exact to={props.route}>
      <div className={`topnav-item ${isActive && "selected"}`}>
        {props.title}
      </div>
    </NavLink>
  );
}

export default function TopNav(): JSX.Element {
  return (
    <div className={"topnav-container"}>
      <TopNavItem route="/home" title="Home" />
      <TopNavItem route="/learn" title="Learn" />
      <TopNavItem route="/teach" title="teach" />
      <TopNavItem route="/xr" title="XR" />
    </div>
  );
}
