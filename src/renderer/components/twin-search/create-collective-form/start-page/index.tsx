import { RouteComponentProps, useNavigate } from "@reach/router";
import { useDispatch } from "react-redux";
import { ReactComponent as RightArrow } from "../../../../../assets/svg/right-arrow-icon.svg";
import {
  CollectiveAI,
  CollectiveAIType,
} from "../../../../api/types/collective-ai/create-collective-ai";
import reduxAction from "../../../../redux/reduxAction";
import ButtonSimple from "../../../button-simple";
import "./index.scss";

export default function CreateClollectiveStart(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: RouteComponentProps
): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goNext = () => {
    navigate("/customize/name");
  };

  const addTypeToForm = (type: CollectiveAIType) => {
    reduxAction(dispatch, {
      type: "SET_AI_COLLECTIVE_DATA",
      arg: { type },
    });
  };
  const collectiveAiTypes = [
    "Software",
    "People",
    "Public Person",
    "Insitution",
    "Animal",
    "Plant",
    "Object",
  ];
  return (
    <>
      <div className="form-header">
        <div className="title">Create A Collective Intellgience</div>
        <div className="description">
          This is the AI you and your peers will create together.{" "}
        </div>
        <div className="template-title">START FROM A TEMPLATE</div>
      </div>
      <div className="form-body">
        <ButtonSimple
          key="reset"
          className="options-btn"
          onClick={() => {
            reduxAction(dispatch, {
              type: "RESET_COLLECTIVE_AI_FORM",
              arg: null,
            });
          }}
        >
          <div className="btn-title">Test Reset</div>
          <RightArrow fill="var(--color-text))" />
        </ButtonSimple>
        {collectiveAiTypes.map((type: string) => {
          return (
            <ButtonSimple
              key={type}
              className="options-btn"
              onClick={() => {
                addTypeToForm(type.toLowerCase() as CollectiveAIType);
                goNext();
              }}
            >
              <div className="btn-title">{type}</div>
              <RightArrow fill="var(--color-text))" />
            </ButtonSimple>
          );
        })}
        {/* <ButtonSimple
          className="options-btn"
          onClick={() => {
            goNext();
          }}
        >
          <div className="btn-title">Institution</div>
          <RightArrow fill="var(--color-text))" />
        </ButtonSimple>
        <ButtonSimple className="options-btn">
          <div className="btn-title">Software</div>
          <RightArrow fill="var(--color-text))" />
        </ButtonSimple>
        <ButtonSimple className="options-btn">
          <div className="btn-title">Plant</div>
          <RightArrow fill="var(--color-text))" />
        </ButtonSimple>
        <ButtonSimple className="options-btn">
          <div className="btn-title">Animal</div>
          <RightArrow fill="var(--color-text))" />
        </ButtonSimple>
        <ButtonSimple className="options-btn">
          <div className="btn-title">Object</div>
          <RightArrow fill="var(--color-text))" />
        </ButtonSimple>
        <ButtonSimple className="options-btn">
          <div className="btn-title">Public Person</div>
          <RightArrow fill="var(--color-text))" />
        </ButtonSimple>
        <ButtonSimple className="options-btn">
          <div className="btn-title">Concept</div>
          <RightArrow fill="var(--color-text))" />
        </ButtonSimple>
        <ButtonSimple className="options-btn">
          <div className="btn-title">Location</div>
          <RightArrow fill="var(--color-text))" />
        </ButtonSimple> */}
      </div>
      <div className="form-footer">
        <div className="footer-title">Does it already exist?</div>
        <ButtonSimple className="footer-btn">Search Super Reality</ButtonSimple>
      </div>
    </>
  );
}
