import { RouteComponentProps, useNavigate } from "@reach/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onTextChange } from "../../../../../utils/chat-utils/common-functions";
import reduxAction from "../../../../redux/reduxAction";
import ButtonSimple from "../../../button-simple";
import NeuralFormInput from "../form-input";
import "./index.scss";
import { CollectiveAI } from "../../../../api/types/collective-ai/create-collective-ai";
import AIFormDropFile from "../AIFormDropFile";
import AvatarEditor from "../avatar-editor";
import { AppState } from "../../../../redux/stores/renderer";

export default function CustomizeNameAvatar(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  props: RouteComponentProps
): JSX.Element {
  const dispatch = useDispatch();
  const { name, icon } = useSelector(
    (state: AppState) => state.createCollectiveAI
  );
  const [aiName, setAiName] = useState<string>(name);
  const [avatar, setAvatar] = useState<string>(icon);
  const [isEditor, setIsEditor] = useState<boolean>(false);
  const navigate = useNavigate();

  const addCollectiveAIDataToForm = (formProps: Partial<CollectiveAI>) => {
    reduxAction(dispatch, {
      type: "SET_AI_COLLECTIVE_DATA",
      arg: { ...formProps },
    });
  };
  return (
    <>
      {isEditor ? (
        avatar && (
          <AvatarEditor
            filePath={avatar}
            setImage={setAvatar}
            openEditor={setIsEditor}
          />
        )
      ) : (
        <>
          <div className="form-header name-header">
            <div className="title">Customize Your Nueral Network</div>
            <div className="description">Avatar ( image or gltf )</div>
            <div className="network-avatar">
              <AIFormDropFile
                setFile={setAvatar}
                openEditor={setIsEditor}
                filePath={avatar}
                borderRadius="50%"
              />
            </div>
          </div>

          <div className="fields-description">
            Name ( what you will call it )
          </div>
          <div className="form-body">
            <NeuralFormInput
              inputClassName="neural-form-input"
              placeholder="Name"
              onChange={(e) => {
                onTextChange(e, setAiName);
              }}
              value={aiName}
            />

            {/* <ButtonSimple className="options-btn">
          <div className="btn-title">Voice</div>
          <DownArrow fill="var(--color-text))" />
        </ButtonSimple> */}
          </div>
          <div className="form-footer row">
            <ButtonSimple
              className="back-btn"
              onClick={() => {
                navigate("/");
              }}
            >
              Back
            </ButtonSimple>
            <ButtonSimple
              className="next-btn"
              onClick={() => {
                addCollectiveAIDataToForm({ name: aiName, icon: avatar });
                navigate("/customize/soul");
              }}
            >
              Next
            </ButtonSimple>
          </div>
        </>
      )}
    </>
  );
}
