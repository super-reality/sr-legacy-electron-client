import React from "react";
import "./index.scss";
import "../../components/containers.scss";
import { useSelector } from "react-redux";
import Collapsible from "../../components/collapsible";
import { AppState } from "../../redux/stores/renderer";
import Category from "../../../types/collections";
import SelectHeader from "../../components/select-header";

export default function Discover(): JSX.Element {
  const topSelectStates = useSelector(
    (state: AppState) => state.render.topSelectStates
  );
  const current = (topSelectStates["/discover"] as Category) || Category.All;

  return (
    <div className="mid">
      <SelectHeader />
      {current == Category.Lesson || current == Category.All ? (
        <Collapsible expanded title="Lessons" />
      ) : (
        <></>
      )}
      {current == Category.Subject || current == Category.All ? (
        <Collapsible expanded title="Subjects" />
      ) : (
        <></>
      )}
      {current == Category.Collection || current == Category.All ? (
        <Collapsible expanded title="Collections" />
      ) : (
        <></>
      )}
      {current == Category.Organization || current == Category.All ? (
        <Collapsible expanded title="Organizations" />
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
      {current == Category.Project || current == Category.All ? (
        <Collapsible expanded title="Projects" />
      ) : (
        <></>
      )}
      {current == Category.Task || current == Category.All ? (
        <Collapsible expanded title="Tasks" />
      ) : (
        <></>
      )}
      {current == Category.Resource || current == Category.All ? (
        <Collapsible expanded title="Resources" />
      ) : (
        <></>
      )}
      {current == Category.Portfolio || current == Category.All ? (
        <Collapsible expanded title="Portfolios" />
      ) : (
        <></>
      )}
    </div>
  );
}
