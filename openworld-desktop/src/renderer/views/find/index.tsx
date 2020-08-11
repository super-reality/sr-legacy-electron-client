import React from "react";
import "./index.scss";
import Collapsible from "../../components/collapsible";
import {useSelector} from "react-redux";
import {AppState} from "../../redux/stores/renderer";
import {Category} from "../../../types/collections";

export default function Find(): JSX.Element {
  const topSelectStates = useSelector(
    (state: AppState) => state.render.topSelectStates
  );
  const current = topSelectStates["/find"] || Category.All;

  return (
    <div className="mid">
      {current == Category.Subject || current == Category.All ? (
        <Collapsible expanded={true} title="Subjects"></Collapsible>
      ) : (
        <></>
      )}
      {current == Category.Organization || current == Category.All ? (
        <Collapsible expanded={true} title="Organizations"></Collapsible>
      ) : (
        <></>
      )}
      {current == Category.Collection || current == Category.All ? (
        <Collapsible expanded={true} title="Collections"></Collapsible>
      ) : (
        <></>
      )}
      {current == Category.Teacher || current == Category.All ? (
        <Collapsible expanded={true} title="Teachers"></Collapsible>
      ) : (
        <></>
      )}
      {current == Category.Student || current == Category.All ? (
        <Collapsible expanded={true} title="Students"></Collapsible>
      ) : (
        <></>
      )}
      {current == Category.Want || current == Category.All ? (
        <Collapsible expanded={true} title="Wants"></Collapsible>
      ) : (
        <></>
      )}
      {current == Category.TeacherBot || current == Category.All ? (
        <Collapsible expanded={true} title="Teacher Bots"></Collapsible>
      ) : (
        <></>
      )}
    </div>
  );
}
