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
      <TopNavItem route="/find" title="Find" />
      <TopNavItem route="/learn" title="Learn" />
      <TopNavItem route="/teach" title="Teach" />
      <TopNavItem route="/connect" title="Connect" />
    </div>
  );
}
