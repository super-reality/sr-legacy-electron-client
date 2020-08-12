import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import usePopup from "./usePopup";
import ButtonSimple from "../components/button-simple";
import "../components/popups.scss";
import { Icon } from "../components/item-inner";
import ShareButton from "../components/share-button";

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
      margin="8px 16px"
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
    <Popup width="400px" height="600px">
      <div className="popup-regular-title">Create</div>
      <div>
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
        <ButtonCreate
          title="Collection"
          sub="Organize subjects into collections"
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
        <ButtonCreate
          title="Track"
          sub="Create curated lesson tracks for your students"
          onClick={clickLesson}
        />
      </div>
    </Popup>
  );

  return [Element, doOpen];
}
