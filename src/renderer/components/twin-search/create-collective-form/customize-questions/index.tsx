import { RouteComponentProps, useNavigate } from "@reach/router";
import { useState } from "react";
import { onTextChange } from "../../../../../utils/chat-utils/common-functions";
import ButtonSimple from "../../../button-simple";
import NeuralFormInput from "../form-input";

export default function CustomizeQuestions(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: RouteComponentProps
): JSX.Element {
  const [question1, setQuestion1] = useState<string>("");
  const [question2, setQuestion2] = useState<string>("");
  const [question3, setQuestion3] = useState<string>("");
  const navigate = useNavigate();
  return (
    <>
      <div className="form-header">
        <div className="title">What are intro questions it might ask?</div>
      </div>

      <div className="form-body">
        <div className="fields-description row">
          <div className="descrioption-info">
            Write things it would be curious about it&#39;s users
          </div>
        </div>

        <NeuralFormInput
          inputClassName="neural-form-input"
          value={question1}
          placeholder="Question 1"
          onChange={(e) => {
            onTextChange(e, setQuestion1);
          }}
        />
        <NeuralFormInput
          inputClassName="neural-form-input"
          value={question2}
          placeholder="Question 2"
          onChange={(e) => {
            onTextChange(e, setQuestion2);
          }}
        />
        <NeuralFormInput
          inputClassName="neural-form-input"
          value={question3}
          placeholder="Question 3"
          onChange={(e) => {
            onTextChange(e, setQuestion3);
          }}
        />
      </div>
      <div className="form-footer row">
        <ButtonSimple
          className="back-btn"
          onClick={() => {
            navigate("/customize/paragraph");
          }}
        >
          Back
        </ButtonSimple>
        <ButtonSimple
          className="next-btn"
          onClick={() => {
            console.log("create Nueral network");
          }}
        >
          Create
        </ButtonSimple>
      </div>
    </>
  );
}
