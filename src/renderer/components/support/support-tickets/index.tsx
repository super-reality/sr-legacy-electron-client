import React, { useEffect, useState } from "react";
import "./index.scss";

import { useDispatch } from "react-redux";
import { navigate, RouteComponentProps } from "@reach/router";
import reduxAction from "../../../redux/reduxAction";

import {
  supportTicketPayload,
  IData,
} from "../../../api/types/support-ticket/supportTicket";

import getSupportTickets from "./support-tickets-utils/getSupportTickets";
import searchSupportTickets from "./support-tickets-utils/searchSupportTickets";
import getCategories from "../support-help/support-help-utils/getCategories";
import getVibes from "../support-help/support-help-utils/getVibes";
import AutosuggestInput from "../../autosuggest-input";
import BackToSupport from "../support-menu/goback-button";

import SingleTicket from "./single-ticket";

import SupperSpinner from "../../super-spinner";

import { setSidebarWidth } from "../../../../utils/setSidebarWidth";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";

interface IfilterOptions {
  name?: string;
  category?: string;
  limit?: number;
}

/* eslint-disable no-shadow */
/* eslint-disable  react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable  @typescript-eslint/no-use-before-define */
export default function SupportTickets(
  props: RouteComponentProps
): JSX.Element {
  console.log(props);
  const dispatch = useDispatch();
  const [tickets, setTickets] = useState<supportTicketPayload[]>([]);

  const [filterOption, setFilterOption] = useState<string>("");

  const [searchOption, setSearchOption] = useState<string>("");

  const [searchCategory, setSearchCategory] = useState<string>("");

  const [isFetching, setIsFetching, scrollRef] = useInfiniteScroll(
    // eslint-disable-next-line no-use-before-define
    fetchMoreListItems
  );

  function fetchMoreListItems() {
    setTimeout(() => {
      setTickets(tickets.concat(tickets));
      setIsFetching(false);
    }, 2000);
  }

  let searchedCategories: IData[] = [];
  const searchResults: supportTicketPayload[] = [];

  const searchCategories = (value: string): IData[] => {
    (async () => {
      await getCategories(value).then((categories) => {
        searchedCategories = [...categories];
      });
    })();
    return searchedCategories;
  };

  const filterTickets = (search: IfilterOptions) => {
    (async () => {
      await searchSupportTickets(search).then((ticks) => {
        setTickets(ticks);
      });
    })();

    return searchResults;
  };

  useEffect(() => {
    setSidebarWidth(900);
    (async () => {
      await getVibes().then((result) => {
        reduxAction(dispatch, {
          type: "SET_SUPPORT_TICKET",
          arg: {
            vibeData: result,
          },
        });
      });
    })();
    (async () => {
      await getSupportTickets().then((tickets) => {
        setTickets(tickets.reverse());
      });
    })();
  }, []);

  useEffect(() => {
    let arrayTickets: supportTicketPayload[] = [];
    if (filterOption === "oldest") {
      arrayTickets = [...tickets];
      setTickets(arrayTickets.reverse());
    }

    if (filterOption === "newest") {
      arrayTickets = [...tickets];
      setTickets(arrayTickets.reverse());
    }
  }, [filterOption]);

  useEffect(() => {
    let ob: IfilterOptions = {};

    console.log(searchOption);
    console.log(searchCategory);

    if (searchOption == "" && searchCategory == "") {
      (async () => {
        await getSupportTickets().then((tickets) => {
          setTickets(tickets.reverse());
        });
      })();
    }

    if (searchOption != "" && searchCategory != "") {
      console.log("SI");
      ob = {
        name: searchOption,
        category: searchCategory,
        limit: 10,
      };
      console.log(ob);
      (async () => {
        await filterTickets(ob);
      })();
    }

    if (searchOption != "" && searchCategory == "") {
      console.log("NO");
      ob = {
        name: searchOption,
        limit: 10,
      };
      console.log(ob);
      (async () => {
        await filterTickets(ob);
      })();
    }

    if (searchOption == "" && searchCategory != "") {
      console.log("TALVEZ");
      ob = {
        category: searchCategory,
        limit: 10,
      };
      console.log(ob);
      (async () => {
        await filterTickets(ob);
      })();
    }
  }, [searchOption, searchCategory]);

  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOption(e.target.value);
  };

  const searchTickets = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchOption(e.target.value);
  };

  return (
    <div id="support-tickets">
      <div className="ticket-title">Filter By</div>
      <div className="ticket-container" id="ticket-container">
        <div className="ticket-category">
          Category
          <AutosuggestInput<IData>
            filter={searchCategories}
            getValue={(suggestion: IData) => {
              console.log(suggestion);
              return suggestion.name;
            }}
            onChangeCallback={(s) => {
              if (s.length == 0) setSearchCategory("");
            }}
            renderSuggestion={(suggestion) => <div>{suggestion.name}</div>}
            initialValue=""
            id="category-search"
            submitCallback={(value: IData) => setSearchCategory(value._id)}
            placeholder="Select Category"
          />
          <BackToSupport
            onClick={() => navigate("/")}
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "85%",
            }}
          />
        </div>

        <div className="ticket-search" ref={scrollRef}>
          <div className="ticket-wrapper" id="ticket-wrapper">
            <input
              type="text"
              value={searchOption}
              onChange={searchTickets}
              placeholder="Search title"
            />
            <a>Advanced Search</a>
            <div className="request-count">
              {tickets.length} Help Requests
              <div className="sort-filter">
                <select value={filterOption} onChange={handleFilter}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>

            {tickets.length == 0 ? (
              <div className="loading-tickets">
                <SupperSpinner size="200px" text="Loading Tickets" />
              </div>
            ) : (
              <>
                <div className="ticket-list" id="ticket-list">
                  {tickets.map((ticket, index) => (
                    <SingleTicket
                      onClick={() =>
                        ticket._id && navigate(`/give/${ticket._id}`)
                      }
                      key={ticket._id}
                      index={index}
                      votes={ticket.votes!}
                      id={ticket._id!}
                      {...ticket}
                      timeposted={ticket.createdAt!}
                    />
                  ))}
                </div>
                {isFetching && (
                  <div>
                    <SupperSpinner size="100px" text="Fetching new tickets" />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
