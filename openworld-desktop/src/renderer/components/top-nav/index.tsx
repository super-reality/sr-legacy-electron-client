import React from "react";
import css from "./index.scss";
import { NavLink } from "react-router-dom";

export default function TopNav(): JSX.Element {
  return (
    <div className={css.container}>
      <NavLink style={{ textDecoration: "none" }} exact to="/home">
        <div className={css.item}>Home</div>
      </NavLink>
      <NavLink style={{ textDecoration: "none" }} exact to="/learn">
        <div className={css.item}>Learn</div>
      </NavLink>
      <NavLink style={{ textDecoration: "none" }} exact to="/teach">
        <div className={css.item}>Teach</div>
      </NavLink>
      <NavLink style={{ textDecoration: "none" }} exact to="/xr">
        <div className={css.item}>XR</div>
      </NavLink>
    </div>
  );
}
