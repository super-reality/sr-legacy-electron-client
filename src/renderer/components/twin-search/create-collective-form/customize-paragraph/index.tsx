import { RouteComponentProps, useNavigate } from "@reach/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as RightArrow } from "../../../../../assets/svg/right-arrow-icon.svg";
import { onTextChange } from "../../../../../utils/chat-utils/common-functions";
import { CollectiveAI } from "../../../../api/types/collective-ai/create-collective-ai";
import reduxAction from "../../../../redux/reduxAction";
import { AppState } from "../../../../redux/stores/renderer";
import BaseTextArea from "../../../base-textarea";
import ButtonSimple from "../../../button-simple";
import { createCollectiveAI } from "../../../collective-ai/utils/utils";
import "./index.scss";

export default function CustomizeParagraph(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: any
): JSX.Element {
  const { onClose } = props;
  const collectiveParams = useSelector(
    (state: AppState) => state.createCollectiveAI
  );
  const dispatch = useDispatch();
  const [paragraph, setParagraph] = useState<string>("");
  const [gptParagraph, setGptParagraph] = useState<string>("");
  const navigate = useNavigate();

  const getGptTranslation = (text: string) => {
    setGptParagraph(text);
  };
  const onClick = () => {
    getGptTranslation(paragraph);
  };
  const addCollectiveAIDataToForm = (formProps: Partial<CollectiveAI>) => {
    reduxAction(dispatch, {
      type: "SET_AI_COLLECTIVE_DATA",
      arg: { ...formProps },
    });
  };

  const createAndClose = () => {
    addCollectiveAIDataToForm({ paragraph: gptParagraph });

    createCollectiveAI(collectiveParams);
    onClose();
  };
  return (
    <>
      <div className="form-header">
        <div className="title">Introduction</div>
      </div>

      <div className="form-body">
        <div className="fields-description row">
          <div className="description-info">Wikipedia Paragraph</div>
          <div className="go-btn" onClick={onClick}>
            GO
          </div>
        </div>
        <BaseTextArea
          value={paragraph}
          onChange={(e) => {
            onTextChange(e, setParagraph);
          }}
        />

        <div className="fields-description">GPT-3 Translation Paragraph</div>
        <BaseTextArea
          style={{ backgroundColor: "var(--color-white)" }}
          value={gptParagraph}
          onChange={(e) => {
            onTextChange(e, setGptParagraph);
          }}
        />
      </div>
      <div className="form-footer row">
        <ButtonSimple
          className="back-btn"
          onClick={() => {
            navigate("/customize/soul");
          }}
        >
          Back
        </ButtonSimple>
        <ButtonSimple
          className="next-btn"
          onClick={() => {
            createAndClose();
            navigate("/");
          }}
        >
          Create
        </ButtonSimple>
      </div>
    </>
  );
}
