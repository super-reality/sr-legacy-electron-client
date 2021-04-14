import React, { useState } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { RouteComponentProps, useNavigate } from "@reach/router";
import { AppState } from "../../../../redux/stores/renderer";
import reduxAction from "../../../../redux/reduxAction";
/* import { SupportSectionsProps } from ".."; */

import { TsupportType } from "../../../../api/types/support-ticket/supportTicket";
import LearningSkill from "./learning-skill";
import BackToSupport from "../../support-menu/goback-button";

const NONE = 0;
const SKILLS = 1;
const BUILD = 2;
const CONNECT = 3;

export const SKILLS_SHORT = "help_short";
export const SKILLS_LONG = "help_long";

type startoptions = typeof NONE | typeof SKILLS | typeof BUILD | typeof CONNECT;

interface FormSubmitInterface {
  target: HTMLInputElement;
}

const verifyState = (value: TsupportType): startoptions => {
  if (value == SKILLS_LONG || value == SKILLS_SHORT) {
    return SKILLS;
  }
  if (value == "build") {
    return BUILD;
  }

  if (value == "question") {
    return CONNECT;
  }

  return NONE;
};

export default function GettingStarted(
  props: RouteComponentProps
): JSX.Element {
  console.log(props);
  const navigate = useNavigate();
  const { supportType } = useSelector(
    (state: AppState) => state.createSupportTicket
  );
  const dispatch = useDispatch();

  const [activeRadio, setactiveRadio] = useState<startoptions>(
    verifyState(supportType)
  );
  const [supportT, setSupportType] = useState<TsupportType>(
    supportType ?? SKILLS_SHORT
  );

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

  const handleSubmit = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    reduxAction(dispatch, {
      type: "SET_SUPPORT_TICKET",
      arg: {
        supportType: supportT,
      },
    });
    if (navigate) navigate("/ask/help");
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
              <input
                type="radio"
                checked={activeRadio == SKILLS}
                id="skill"
                name="start"
              />
              <span className="checkmark" />
              <label>Get Help Learning a Skill</label>
            </div>

            {activeRadio == SKILLS && (
              <LearningSkill type={supportT} setType={setSupportType} />
            )}

            <div className="custom-radiobutton">
              <input
                type="radio"
                checked={activeRadio == BUILD}
                id="build"
                name="start"
              />
              <span className="checkmark" />
              <label>Get Help Building something coo</label>
            </div>

            {activeRadio == BUILD && <h1>BUILD</h1>}

            <div className="custom-radiobutton">
              <input
                type="radio"
                checked={activeRadio == CONNECT}
                id="connect"
                name="start"
              />
              <span className="checkmark" />
              <label>Get Help connectiong with a &quot;like&quot; mind</label>
            </div>

            {activeRadio == CONNECT && <h1>CONNECT</h1>}

            <div className="support-buttons">
              <BackToSupport
                style={{
                  marginBottom: 0,
                  marginRight: "25px",
                }}
                onClick={() => navigate("../")}
              />

              <button
                disabled={activeRadio == NONE && true}
                onClick={handleSubmit}
                type="submit"
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
