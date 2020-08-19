import React, { useCallback, useState, useMemo } from "react";
import "../create-lesson/index.scss";
import "../containers.scss";
import Flex from "../flex";
import ButtonSimple from "../button-simple";
import AutosuggestInput from "../autosuggest-input";
import Select from "../select";

interface Lang {
  name: string;
  year: number;
}

const languages: Lang[] = [
  {
    name: "C",
    year: 1972,
  },
  {
    name: "C#",
    year: 2000,
  },
  {
    name: "C++",
    year: 1983,
  },
  {
    name: "Clojure",
    year: 2007,
  },
  {
    name: "Elm",
    year: 2012,
  },
  {
    name: "Go",
    year: 2009,
  },
  {
    name: "Haskell",
    year: 1990,
  },
  {
    name: "Java",
    year: 1995,
  },
  {
    name: "JavaScript",
    year: 1995,
  },
  {
    name: "Perl",
    year: 1987,
  },
  {
    name: "PHP",
    year: 1995,
  },
  {
    name: "Python",
    year: 1991,
  },
  {
    name: "Ruby",
    year: 1995,
  },
  {
    name: "Scala",
    year: 2003,
  },
];

const getVal = (suggestion: Lang) => suggestion.name;
const renderVal = (suggestion: Lang) => <div>{suggestion.name}</div>;

// Teach Autosuggest how to calculate suggestions for any given input value.
const getVals = (str: string) => {
  const inputValue = str.trim().toLowerCase();

  return inputValue.length === 0
    ? []
    : languages.filter(
        (lang) => lang.name.toLowerCase().indexOf(inputValue) > -1
      );
};

const entryOptions = ["Bid", "Invite", "Free"]; // ?

export default function PublishAuthoring(): JSX.Element {
  const [entry, setEntry] = useState(entryOptions[0]);
  return (
    <>
      <Flex>
        <div className="container-with-desc">
          <div>Parent Subject</div>
          <AutosuggestInput<Lang>
            getValue={getVal}
            renderSuggestion={renderVal}
            filter={getVals}
            id="parent-subject"
            submitCallback={(l) => console.log(l)}
          />
        </div>
      </Flex>
      <Flex>
        <div className="container-with-desc">
          <div>Entry</div>
          <Select current={entry} options={entryOptions} callback={setEntry} />
        </div>
      </Flex>
      <Flex style={{ marginTop: "8px" }}>
        <ButtonSimple
          margin="8px auto"
          width="200px"
          height="24px"
          onClick={() => {}}
        >
          Publish
        </ButtonSimple>
      </Flex>
    </>
  );
}
