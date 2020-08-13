import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import usePopup from "./usePopup";
import ButtonSimple from "../components/button-simple";
import "../components/popups.scss";
import { Icon } from "../components/item-inner";
import ShareButton from "../components/share-button";
import Collapsible from "../components/collapsible";

interface ButtonCreate {
  title: string;
  sub: string;
  onClick: () => void;
}

function ButtonCreate(props: ButtonCreate): JSX.Element {
  const { onClick, title, sub } = props;
  return (
    <ButtonSimple
      style={{ padding: "0px" }}
      margin="4px 0"
      height="46px"
      onClick={onClick}
    >
      <Icon url="" style={{ width: "32px", margin: "auto 8px" }} />
      <div style={{ width: "calc(100% - 80px)" }}>
        <div>{title}</div>
        <div
          style={{
            width: "calc(100% - 16px)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "10px",
          }}
        >
          {sub}
        </div>
      </div>
      <ShareButton style={{ marginRight: "12px" }} />
    </ButtonSimple>
  );
}

export default function usePopupCreate(): [() => JSX.Element, () => void] {
  const [Popup, doOpen, close] = usePopup(false);
  const history = useHistory();

  const clickLesson = useCallback(() => {
    history.push("/create/lesson");
    close();
  }, [close, history]);

  const Element = () => (
    <Popup width="400px" height="700px">
      <div className="popup-regular-title">Create</div>
      <div style={{ margin: "0 16px" }}>
        <Collapsible expanded title="Popular">
          <ButtonCreate
            title="Help"
            sub="Screen share and chat with your mentors"
            onClick={clickLesson}
          />
          <ButtonCreate
            title="Tasks"
            sub="Assign tasks to users"
            onClick={clickLesson}
          />
          <ButtonCreate
            title="Portfolio Piece"
            sub="Showcase your work in your portfolio"
            onClick={clickLesson}
          />
          <ButtonCreate
            title="Lesson"
            sub="Teach a man to he will never go hungry"
            onClick={clickLesson}
          />
        </Collapsible>
        <Collapsible expanded title="Productivity">
        <ButtonCreate
            title="Organization"
            sub="Group users inside of these"
            onClick={clickLesson}
          />
          <ButtonCreate
            title="Project"
            sub="Org members work together on projects"
            onClick={clickLesson}
          />
          <ButtonCreate
            title="Resource"
            sub="Create an asset for users to see"
            onClick={clickLesson}
          />
          <ButtonCreate
            title="Collection"
            sub="Organize subjects into collections"
            onClick={clickLesson}
          />
          <ButtonCreate
            title="Event"
            sub="Automatically notify users on anything"
            onClick={clickLesson}
          />
          <ButtonCreate
            title="Subject"
            sub="Organize lessons into subjects"
            onClick={clickLesson}
          />
          <ButtonCreate
            title="Lesson"
            sub="Teach a man to he will never go hungry"
            onClick={clickLesson}
          />
        </Collapsible>
      </div>
    </Popup>
  );

  return [Element, doOpen];
}
