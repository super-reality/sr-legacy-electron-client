import React from "react";
import { useLocation } from "react-router-dom";
import CreateCollection from "../../components/create-collection";
import CreateLesson from "../../components/create-lesson";
import ButtonSimple from "../../components/button-simple";
import TopSearch from "../../components/top-search";
import Collapsible from "../../components/collapsible";
import Collection from "../../components/collection";
import { mockCollections } from "../../../mocks";

export default function Tests(): JSX.Element {
  const location = useLocation();

  let Component = <CreateLesson />;
  if (location.pathname == "/tests/1") Component = <CreateCollection />;
  if (location.pathname == "/tests/2")
    Component = (
      <Collapsible expanded outer title="Expanded test">
        <ButtonSimple width="200px" height="48x" onClick={() => {}}>
          A Button
        </ButtonSimple>
        <ButtonSimple
          margin="16px"
          width="200px"
          height="24x"
          onClick={() => {}}
        >
          A thinner Button
        </ButtonSimple>
        <ButtonSimple
          className="button-login"
          margin="auto"
          width="400px"
          height="24x"
          onClick={() => {}}
        >
          Centered Login Button
        </ButtonSimple>
      </Collapsible>
    );
  if (location.pathname == "/tests/3")
    Component = (
      <Collapsible expanded={false} title="Not Expanded test">
        <ButtonSimple width="200px" height="24px" onClick={() => {}}>
          A Button
        </ButtonSimple>
      </Collapsible>
    );
  if (location.pathname == "/tests/4") Component = <TopSearch />;
  if (location.pathname == "/tests/5")
    Component = <Collection data={mockCollections[0]} />;

  return <div className="content">{Component}</div>;
}
