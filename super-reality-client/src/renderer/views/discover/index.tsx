import React, { useState } from "react";
import "./index.scss";
import "../../components/containers.scss";
import { useRouteMatch } from "react-router-dom";
import Collapsible from "../../components/collapsible";
import Category from "../../../types/collections";
import DiscoverFinder from "../../components/discover-finder";
import CollectionActive from "../../components/collection-active";
import SubjectActive from "../../components/subject-active";
import LessonActive from "../../components/lesson-active";
import { TopTabs, TopTabsContainer } from "../../components/top-panel/top-tabs";
import Test from "../test";
import Collection from "../../components/collection";
import CollectionNew from "../../components/collection-new/collection-all";
import { mockCollections } from "../../../mocks";
import {
  ContainerBottom,
  ContainerFlex,
  ContainerTop,
  ItemInner,
  Title,
  Image,
} from "../../components/item-inner";
import ContainerBasic from "../../components/base/base-container";
import ButtonSimple from "../../components/button-simple";

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

  // My code Denis

  // Move it to the separate component
  // Test Array
  enum TestEnum {
    All,
    Jobs,
    Tracks,
    Lessons,
    Groups,
    Projects,
    Resources,
  }
  type Sections = keyof typeof TestEnum;
  const sections: Sections[] = [
    "All",
    "Jobs",
    "Tracks",
    "Lessons",
    "Groups",
    "Projects",
    "Resources",
  ];

  const [view, setView] = useState(sections[0]);
  const ContentArray = [
    "Jobs",
    "Tracks",
    "Lessons",
    "Groups",
    "Projects",
    "Resourses",
  ];

  return (
    <>
      <div className="front-page-container">
        <TopTabs
          className="front-page-tabs"
          buttons={sections}
          initial={view}
          callback={setView}
          width="fit-content"
          height="23px"
          style={{
            alignItems: "stretch",
            width: "max-content",
          }}
        />
        <TopTabsContainer
          className="front-page-tabs-container"
          style={{ width: "fit-content" }}
        >
          {view == "All" && <CollectionNew dataArray={ContentArray} />}
        </TopTabsContainer>
      </div>
    </>
  );
}

/*
<ContainerFlex style={{ display: "flex", flexDirection: "row" }}>
          <ItemInner>
            <ContainerTop>
              <Title title={ContentArray[TestEnum.All]} />
            </ContainerTop>
            <ContainerFlex>
              <Image

                src="https://www.cambridgeconsultants.com/sites/default/files/uploaded-images/Hero_Blog_VR-is-ready.jpg" />
            </ContainerFlex>
            <ContainerBottom>
              <Title title={ContentArray[TestEnum.All]} />
            </ContainerBottom>
          </ItemInner>
          <ItemInner>
            <ContainerTop>
              <Title title={ContentArray[TestEnum.All]} />
            </ContainerTop>
            <ContainerFlex>
              <Image

                src="https://www.cambridgeconsultants.com/sites/default/files/uploaded-images/Hero_Blog_VR-is-ready.jpg" />
            </ContainerFlex>
            <ContainerBottom>
              <Title title={ContentArray[TestEnum.All]} />
            </ContainerBottom>
          </ItemInner>
          <ItemInner>
            <ContainerTop>
              <Title title={ContentArray[TestEnum.All]} />
            </ContainerTop>
            <ContainerFlex>
              <Image

                src="https://blog.dataart.com/wp-content/uploads/2013/12/21.png" />
            </ContainerFlex>
            <ContainerBottom>
              <Title title={ContentArray[TestEnum.All]} />
            </ContainerBottom>
          </ItemInner>
        </ContainerFlex>

{ContentArray[TestEnum[currentCollection]]}
        <Collection data={mockCollections[TestEnum[currentCollection]]} />
*/
