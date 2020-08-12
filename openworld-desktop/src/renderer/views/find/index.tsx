import React from "react";
import "./index.scss";
import { useSelector } from "react-redux";
import Collapsible from "../../components/collapsible";
import { AppState } from "../../redux/stores/renderer";
import Category from "../../../types/collections";

export default function Find(): JSX.Element {
  const topSelectStates = useSelector(
    (state: AppState) => state.render.topSelectStates
  );
  const current = topSelectStates["/find"] || Category.All;

  return (
    <div className="mid">
      {current == Category.Subject || current == Category.All ? (
        <Collapsible expanded title="Subjects" />
      ) : (
        <></>
      )}
      {current == Category.Organization || current == Category.All ? (
        <Collapsible expanded title="Organizations" />
      ) : (
        <></>
      )}
      {current == Category.Collection || current == Category.All ? (
        <Collapsible expanded title="Collections" />
      ) : (
        <></>
      )}
      {current == Category.Teacher || current == Category.All ? (
        <Collapsible expanded title="Teachers" />
      ) : (
        <></>
      )}
      {current == Category.Student || current == Category.All ? (
        <Collapsible expanded title="Students" />
      ) : (
        <></>
      )}
      {current == Category.Want || current == Category.All ? (
        <Collapsible expanded title="Wants" />
      ) : (
        <></>
      )}
      {current == Category.TeacherBot || current == Category.All ? (
        <Collapsible expanded title="Teacher Bots" />
      ) : (
        <></>
      )}
    </div>
  );
}
