import React from "react";
import "./index.scss";
import "../../components/containers.scss";
import { useRouteMatch } from "react-router-dom";
import Collapsible from "../../components/collapsible";
import Category from "../../../types/collections";
import DiscoverFinder from "../../components/discover-finder";
import CollectionActive from "../../components/collection-active";
import SubjectActive from "../../components/subject-active";
import LessonActive from "../../components/lesson-active";

export default function Discover(): JSX.Element {
  const catMatch = useRouteMatch<{
    any: string;
    category: string;
  }>("/discover/:category");
  const current = (catMatch?.params.category || Category.All) as Category;

  const typeMatch = useRouteMatch<{
    type: string;
    id: string;
  }>("/discover/:type/:id");

  const currentType: string | null = typeMatch?.params.type || null;
  const currentId: string | null = typeMatch?.params.id || null;

  if (currentType && currentId) {
    return (
      <>
        {currentType == "collection" && <CollectionActive id={currentId} />}
        {currentType == "subject" && <SubjectActive id={currentId} />}
        {currentType == "lesson" && <LessonActive id={currentId} />}
      </>
    );
  }

  return (
    <>
      {current == Category.Lesson || current == Category.All ? (
        <Collapsible outer expanded={current !== Category.All} title="Lessons">
          <DiscoverFinder category={Category.Lesson} />
        </Collapsible>
      ) : (
        <></>
      )}
      {current == Category.Subject || current == Category.All ? (
        <Collapsible outer expanded={current !== Category.All} title="Subjects">
          <DiscoverFinder category={Category.Subject} />
        </Collapsible>
      ) : (
        <></>
      )}
      {current == Category.Collection || current == Category.All ? (
        <Collapsible
          outer
          expanded={current !== Category.All}
          title="Collections"
        >
          <DiscoverFinder category={Category.Collection} />
        </Collapsible>
      ) : (
        <></>
      )}
      {current == Category.Organization || current == Category.All ? (
        <Collapsible
          outer
          expanded={current !== Category.All}
          title="Organizations"
        />
      ) : (
        <></>
      )}
      {current == Category.Teacher || current == Category.All ? (
        <Collapsible
          outer
          expanded={current !== Category.All}
          title="Teachers"
        />
      ) : (
        <></>
      )}
      {current == Category.Student || current == Category.All ? (
        <Collapsible
          outer
          expanded={current !== Category.All}
          title="Students"
        />
      ) : (
        <></>
      )}
      {current == Category.Project || current == Category.All ? (
        <Collapsible
          outer
          expanded={current !== Category.All}
          title="Projects"
        />
      ) : (
        <></>
      )}
      {current == Category.Task || current == Category.All ? (
        <Collapsible outer expanded={current !== Category.All} title="Tasks" />
      ) : (
        <></>
      )}
      {current == Category.Resource || current == Category.All ? (
        <Collapsible
          outer
          expanded={current !== Category.All}
          title="Resources"
        />
      ) : (
        <></>
      )}
      {current == Category.Portfolio || current == Category.All ? (
        <Collapsible
          outer
          expanded={current !== Category.All}
          title="Portfolios"
        />
      ) : (
        <></>
      )}
    </>
  );
}
