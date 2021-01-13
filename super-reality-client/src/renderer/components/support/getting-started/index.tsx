import React, { useState } from "react";
import "./index.scss";
import { SupportSectionsProps } from "..";

import LearningSkill from "./learning-skill";

const NONE = 0;
const SKILLS = 1;
const BUILD = 2;
const CONNECT = 3;

type startoptions = typeof NONE | typeof SKILLS | typeof BUILD | typeof CONNECT;

interface FormSubmitInterface {
  target: HTMLInputElement;
}

export default function GettingStarted(
  props: SupportSectionsProps
): JSX.Element {
  const { goHelp } = props;

  const [activeRadio, setactiveRadio] = useState<startoptions>(NONE);

  const handleactiveRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id == "skill") {
      setactiveRadio(SKILLS);
    }

    if (e.target.id == "build") {
      setactiveRadio(BUILD);
    }

    if (e.target.id == "connect") {
      setactiveRadio(CONNECT);
    }
  };

  return (
    <>
      <div className="support fade">
        <div className="support-steps">
          <div className="title">New Project</div>
          <div className="step" onChange={handleactiveRadio}>
            <div className="step-title">Getting Started</div>
            <span>What would you like to do?</span>

            <div className="custom-radiobutton">
              <input type="radio" id="skill" name="start" />
              <span className="checkmark" />
              <label>Get Help Learning a Skill</label>
            </div>

            {activeRadio == SKILLS && <LearningSkill />}

            <div className="custom-radiobutton">
              <input type="radio" id="build" name="start" />
              <span className="checkmark" />
              <label>Get Help Building something coo</label>
            </div>

            {activeRadio == BUILD && <h1>BUILD</h1>}

            <div className="custom-radiobutton">
              <input type="radio" id="connect" name="start" />
              <span className="checkmark" />
              <label>Get Help connectiong with a &quot;like&quot; mind</label>
            </div>

            {activeRadio == CONNECT && <h1>CONNECT</h1>}

            <div className="support-buttons">
              <button
                disabled={activeRadio == NONE && true}
                onClick={goHelp}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
