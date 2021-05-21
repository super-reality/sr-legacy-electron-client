import { RouteComponentProps, useNavigate } from "@reach/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { ReactComponent as Add } from "../../../../../assets/svg/add-outline.svg";
import { CollectiveAI } from "../../../../api/types/collective-ai/create-collective-ai";
import useInputOverlaying from "../../../../hooks/useInputOverlaying";
import reduxAction from "../../../../redux/reduxAction";
import ButtonSimple from "../../../button-simple";
import "./index.scss";

interface OptionsProps {
  option: string;
  addActive: (option: string) => void;
}
function Options(props: OptionsProps): JSX.Element {
  const { option, addActive } = props;
  const [active, setActive] = useState<boolean>(false);
  return (
    <div
      className={`define-options ${active ? "active" : ""} `}
      onClick={() => {
        setActive(!active);
        addActive(option);
      }}
    >
      {option}
    </div>
  );
}

export default function CustomizeSoul(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: RouteComponentProps
): JSX.Element {
  const navigate = useNavigate();

  const [skills, setSkills] = useState<string[]>([
    "Game Development",
    "Art",
    "Design",
  ]);
  const [traits, setTraits] = useState<string[]>([
    "Caring",
    "Silly",
    "Curious",
  ]);
  const [goals, setGoals] = useState<string[]>([
    "Happiness",
    "Grow as Game Developer",
    "Connect with other users",
  ]);

  const [activeSkills, setActiveSkills] = useState<string[]>([]);
  const [activeGoals, setActiveGoals] = useState<string[]>([]);
  const [activeTraits, setActiveTraits] = useState<string[]>([]);

  const dispatch = useDispatch();

  const addCollectiveAIDataToForm = (formProps: Partial<CollectiveAI>) => {
    reduxAction(dispatch, {
      type: "SET_AI_COLLECTIVE_DATA",
      arg: { ...formProps },
    });
  };
  const addOption = (category: string) => {
    switch (category) {
      case "skills":
        return (value: string) => setSkills([...skills, value]);
      case "traits":
        return (value: string) => setTraits([...traits, value]);
      case "goals":
        return (value: string) => setGoals([...goals, value]);
      default:
        return (value: string) => console.log(value, category);
    }
  };

  const addActiveOption = (category: string) => {
    switch (category) {
      case "skills":
        return (value: string) => setActiveSkills([...activeSkills, value]);
      case "traits":
        return (value: string) => setActiveTraits([...activeTraits, value]);
      case "goals":
        return (value: string) => setActiveGoals([...activeGoals, value]);
      default:
        return (value: string) => console.log(value, category);
    }
  };

  const [SkillsInput, openSkillsInput] = useInputOverlaying({
    callback: addOption("skills"),
    toStyle: { width: "50%" },
  });
  const [TraitsInput, openTraitsInput] = useInputOverlaying({
    callback: addOption("traits"),
    toStyle: { width: "50%" },
  });
  const [GoalsInput, openGoalsInput] = useInputOverlaying({
    callback: addOption("goals"),
    toStyle: { width: "50%" },
  });
  return (
    <>
      <div className="form-header">
        <div className="title">Define</div>
      </div>

      <div className="form-body">
        <div className="fields-description row">
          <div className="description-info">Add 3 Skills</div>
          <SkillsInput
            key={Math.random()}
            inputClass="define-options options-input"
            placeholder="skill"
          />
          <ButtonSimple onClick={openSkillsInput} className="option-add-btn">
            <Add />
          </ButtonSimple>
        </div>
        <div className="options-pull">
          {skills.map((option) => (
            <Options
              key={option}
              option={option}
              addActive={addActiveOption("skills")}
            />
          ))}
        </div>

        <div className="fields-description row">
          <div className="description-info">Add 3 Personality Traits</div>
          <TraitsInput
            key={Math.random()}
            inputClass="define-options options-input"
            placeholder="trait"
          />
          <ButtonSimple onClick={openTraitsInput} className="option-add-btn">
            <Add />
          </ButtonSimple>
        </div>
        <div className="options-pull">
          {traits.map((option) => (
            <Options
              key={option}
              option={option}
              addActive={addActiveOption("traits")}
            />
          ))}
        </div>
        <div className="fields-description">
          <div className="description-info">
            Add 3 Goals the AI has for users
          </div>
          <GoalsInput
            key={Math.random()}
            inputClass="define-options options-input"
            placeholder="goal"
          />
          <ButtonSimple onClick={openGoalsInput} className="option-add-btn">
            <Add />
          </ButtonSimple>
        </div>
        <div className="options-pull">
          {goals.map((option) => (
            <Options
              key={option}
              option={option}
              addActive={addActiveOption("goals")}
            />
          ))}
        </div>
      </div>
      <div className="form-footer row">
        <ButtonSimple
          className="back-btn"
          onClick={() => {
            navigate("/customize/name");
          }}
        >
          Back
        </ButtonSimple>
        <ButtonSimple
          className="next-btn"
          onClick={() => {
            addCollectiveAIDataToForm({
              skills: activeSkills,
              goals: activeGoals,
              personality: activeTraits,
            });
            navigate("/customize/paragraph");
          }}
        >
          Next
        </ButtonSimple>
      </div>
    </>
  );
}
