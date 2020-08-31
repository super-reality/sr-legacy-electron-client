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
        <div className="discover-separator">
          <div>
            <InnerSearch />
          </div>
          <Select
            style={{
              maxWidth: "180px",
              width: "-webkit-fill-available",
              justifySelf: "self-end",
            }}
            className="dark"
            options={sortOptions}
            current={sort}
            callback={setSort}
          />
        </div>
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
