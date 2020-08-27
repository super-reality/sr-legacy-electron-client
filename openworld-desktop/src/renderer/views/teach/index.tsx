import React from "react";
import "./index.scss";
import "../../components/containers.scss";
import { useRouteMatch } from "react-router-dom";
import Category from "../../../types/collections";

export default function Teach(): JSX.Element {
  const catMatch = useRouteMatch<{
    any: string;
    category: string;
  }>("/teach/:category");
  const current = (catMatch?.params.category || Category.All) as Category;

  return <div className="mid" />;
}
