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
import { Tabs, TabsContainer } from "../../components/tabs";
import Test from "../test";
import Collection from "../../components/collection"
import { mockCollections } from "../../../mocks"
import { ContainerBottom, ContainerFlex, ContainerTop, ItemInner, Title, Image } from "../../components/item-inner";
import ContainerBasic from "../../components/base/base-container"
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


  // Test Array
  type TestSections = "All" | "Jobs" | "Track"
  const testArray: Array<TestSections> = ["All", "Jobs", "Track"]
  enum TestEnum {
    All,
    Jobs,
    Track
  }

  const ContentArray = ["content All", "content jobs", "content tracks"]
  // console.log(TestEnum.All)
  // Test state
  const [currentCollection, setCurrentCollection] = useState(testArray[TestEnum.All])
  return (
    <>
      <Tabs
        buttons={testArray}
        initial={currentCollection}
        callback={setCurrentCollection}
      />
      <TabsContainer style={{ width: "fit-content" }}>
        {ContentArray.map((item, indexF) => {
          return (
            <ContainerBasic key={item} style={{}}>
              <ButtonSimple onClick={() => { console.log("Jobs") }} style={{width: "20vw"}}>
                {`Collection_${indexF}`}
              </ButtonSimple>

              <ContainerFlex style={{ display: "flex", flexDirection: "row" }}>
                {ContentArray.map((itemM, index) => {
                  return (
                    <ItemInner key={itemM} style={{
                      display:"block"
                     }}>
                      <ContainerFlex style={{width: "50vw"}}>
                        <Image
                          src="https://www.cambridgeconsultants.com/sites/default/files/uploaded-images/Hero_Blog_VR-is-ready.jpg" />
                      </ContainerFlex>
                     
                        <Title title={`Collection Item ${index}`} />
                     
                    </ItemInner>
                  )
                })}
              </ContainerFlex>

            </ContainerBasic>
          )
        })}


      </TabsContainer>
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