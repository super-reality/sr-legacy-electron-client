import React from "react";
import "./index.scss";
import "../../components/containers.scss";
import { useRouteMatch } from "react-router-dom";
import Category from "../../../types/collections";
import CreateOption from "../../components/create-option";
import createOptions from "./components";
import CreateCollection from "../../components/create-collection";
import CreateSubject from "../../components/create-subject";

export default function Create(): JSX.Element {
  const catMatch = useRouteMatch<{
    any: string;
    category: string;
  }>("/create/:category");
  const current = (catMatch?.params.category || Category.All) as Category;

  return (
    <>
      {current == Category.All ? (
        createOptions.map((option) => (
          <CreateOption hover key={option.title} data={option} />
        ))
      ) : (
        <></>
      )}
      {current == Category.Collection ? <CreateCollection /> : <></>}
      {current == Category.Subject ? <CreateSubject /> : <></>}
      {current == Category.Lesson ? <></> : <></>}
    </>
  );
}
