/* eslint-disable no-underscore-dangle */
import React, { useState, useCallback, useEffect } from "react";
import "./index.scss";
import Axios from "axios";
import Category from "../../../types/collections";
import InnerSearch from "../inner-search";
import Select from "../select";
import Collection from "../collection";
import { mockCollections } from "../../../mocks";
import { InputChangeEv } from "../../../types/utils";
import setLoading from "../../redux/utils/setLoading";
import { ApiError } from "../../api/types";
import { API_URL } from "../../constants";
import LessonSearch, { LessonSortOptions } from "../../api/types/lesson/search";
import handleDiscoverSearch from "../../api/handleDiscoverSearch";
import constantFormat from "../../../utils/constantFormat";
import LessonActive from "../lesson-active";
import SubjectSearch, {
  SubjectSortOptions,
} from "../../api/types/subject/search";

interface DiscoverFinderProps {
  category: Category;
}

type AllSearch = LessonSearch | SubjectSearch;

export default function DiscoverFinder(
  props: DiscoverFinderProps
): JSX.Element {
  const { category } = props;
  let currentSort: typeof LessonSortOptions | typeof SubjectSortOptions;
  if (category == Category.Subject) currentSort = SubjectSortOptions;
  else currentSort = LessonSortOptions;
  const [sort, setSort] = useState(Object.values(currentSort)[0]);

  const [data, setData] = useState<AllSearch | undefined>(undefined);
  const [searchValue, setSearchValue] = useState("");

  const onChange = useCallback((e: InputChangeEv) => {
    setSearchValue(e.currentTarget.value);
  }, []);

  useEffect(() => {
    if (category == Category.Collection) return;
    let currentUrl: "lesson" | "subject";
    switch (category) {
      case Category.Lesson:
        currentUrl = "lesson";
        break;
      case Category.Subject:
        currentUrl = "subject";
        break;
      default:
        currentUrl = "lesson";
        break;
    }
    const payload = {
      query: searchValue,
      sort: sort,
    };

    setLoading(true);
    Axios.post<AllSearch | ApiError>(`${API_URL}${currentUrl}/search`, payload)
      .then((res) => handleDiscoverSearch(res, currentUrl))
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [sort, searchValue]);

  return (
    <>
      <div className="mid">
        <div className="discover-separator">
          <div>
            <InnerSearch onChange={onChange} value={searchValue} />
          </div>
          <Select
            style={{
              maxWidth: "180px",
              width: "-webkit-fill-available",
              justifySelf: "self-end",
            }}
            className="dark"
            options={Object.values(currentSort)}
            optionFormatter={constantFormat(currentSort)}
            current={sort}
            callback={setSort}
          />
        </div>
      </div>
      <div className="discover-list">
        {category == Category.Collection ? (
          mockCollections.map((d) => <Collection key={d.name} data={d} />)
        ) : (
          <></>
        )}
        {data?.type == "lesson" ? (
          data.lessons.map((d) => <LessonActive key={d._id} data={d} />)
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
