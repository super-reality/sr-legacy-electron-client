/* eslint-disable no-underscore-dangle */
import React, { useState, useCallback, useEffect } from "react";
import "./index.scss";
import Axios from "axios";
import Category from "../../../types/collections";
import InnerSearch from "../inner-search";
import Select from "../select";
import { InputChangeEv } from "../../../types/utils";
import setLoading from "../../redux/utils/setLoading";
import { ApiError } from "../../api/types";
import { API_URL } from "../../constants";
import constantFormat from "../../../utils/constantFormat";
import Collection from "../collection";
import Subject from "../subject";
import Lesson from "../lesson";
import handleDiscoverSearch, {
  AllSearchResults,
  SearchUrlNames,
} from "../../api/handleDiscoverSearch";
import { CollectionSortOptions } from "../../api/types/collection/search";
import { SubjectSortOptions } from "../../api/types/subject/search";
import { LessonSortOptions } from "../../api/types/lesson/search";

interface DiscoverFinderProps {
  category: Category;
}

type SortTypes =
  | typeof LessonSortOptions
  | typeof SubjectSortOptions
  | typeof CollectionSortOptions;

export default function DiscoverFinder(
  props: DiscoverFinderProps
): JSX.Element {
  const { category } = props;
  let currentSort: SortTypes;
  if (category == Category.Subject) currentSort = SubjectSortOptions;
  else currentSort = LessonSortOptions;
  const [sort, setSort] = useState(Object.values(currentSort)[0]);

  const [data, setData] = useState<AllSearchResults | undefined>(undefined);
  const [searchValue, setSearchValue] = useState("");

  const onChange = useCallback((e: InputChangeEv) => {
    setSearchValue(e.currentTarget.value);
  }, []);

  useEffect(() => {
    let currentUrl: SearchUrlNames;
    let fields = "";
    switch (category) {
      case Category.Lesson:
        currentUrl = "lesson";
        fields =
          "medias _id createdAt icon name shortDescription description totalSteps rating";
        break;
      case Category.Subject:
        currentUrl = "subject";
        fields =
          "name _id rating shortDescription description icon medias createdAt rating";
        break;
      case Category.Collection:
        currentUrl = "collection";
        fields =
          "name _id rating shortDescription description icon medias createdAt subjectCount";
        break;
      default:
        currentUrl = "lesson";
        break;
    }
    const payload = {
      query: searchValue,
      sort,
      fields,
    };

    setLoading(true);
    Axios.post<AllSearchResults | ApiError>(
      `${API_URL}${currentUrl}/search`,
      payload
    )
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
        {data?.type == "collection" ? (
          data.collections.map((d) => <Collection key={d.name} data={d} />)
        ) : (
          <></>
        )}
        {data?.type == "subject" ? (
          data.subjects.map((d) => <Subject key={d.name} data={d} />)
        ) : (
          <></>
        )}
        {data?.type == "lesson" ? (
          data.lessons.map((d) => <Lesson key={d._id} data={d} />)
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
