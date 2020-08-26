import React, { useState } from "react";
import "./index.scss";
import Category from "../../../types/collections";
import Flex from "../flex";
import InnerSearch from "../inner-search";
import Select from "../select";
import Collection from "../collection";
import { mockCollections } from "../../../mocks";

const sortOptions = ["Name", "Hghest Rated", "Duration"];

interface DiscoverFinderProps {
  category: Category;
}

export default function DiscoverFinder(
  props: DiscoverFinderProps
): JSX.Element {
  const { category } = props;
  const [sort, setSort] = useState(sortOptions[0]);

  const Component = Collection;

  return (
    <>
      <div className="mid">
        <Flex>
          <div>
            <InnerSearch />
          </div>
          <Select
            style={{ width: "-webkit-fill-available", marginLeft: "8px" }}
            className="dark"
            options={sortOptions}
            current={sort}
            callback={setSort}
          />
        </Flex>
      </div>
      <div className="discover-list">
        {Component ? (
          mockCollections.map((d) => <Component key={d.name} data={d} />)
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
