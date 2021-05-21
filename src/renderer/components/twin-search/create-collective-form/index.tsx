import { Router } from "@reach/router";
import usePopup from "../../../hooks/usePopup";
import CreateClollectiveStart from "./start-page";
import "./index.scss";
import CustomizeNameAvatar from "./customize-name-avatar";
import CustomizeSoul from "./customize-soul";
import CustomizeQuestions from "./customize-questions";
import CustomizeParagraph from "./customize-paragraph";

export default function CreateCollectiveAi(): [() => JSX.Element, () => void] {
  const [FormPopup, doOpen, close] = usePopup(false);

  const Element = () => (
    <FormPopup width="fit-content" height="fit-content">
      <div className="ai-form">
        <Router>
          <CreateClollectiveStart path="/" />
          <CustomizeNameAvatar path="/customize/name" />
          <CustomizeSoul path="/customize/soul" />
          <CustomizeParagraph path="/customize/paragraph" onClose={close} />
          <CustomizeQuestions path="/customize/questions" />
        </Router>
      </div>
    </FormPopup>
  );
  return [Element, doOpen];
}
