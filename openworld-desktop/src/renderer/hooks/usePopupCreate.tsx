import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import usePopup from "./usePopup";
import ButtonSimple from "../components/button-simple";
import "../components/popups.scss";

export default function usePopupCreate(): [() => JSX.Element, () => void] {
  const [Popup, doOpen, close] = usePopup(false);
  const history = useHistory();

  const clickLesson = useCallback(() => {
    history.push("/create/lesson");
    close();
  }, [close, history]);

  const Element = () => (
    <Popup width="300px" height="600px">
      <div className="popup-regular-title">Create</div>
      <div>
        <ButtonSimple margin="8px 16px" height="24px" onClick={clickLesson}>
          Lesson
        </ButtonSimple>
        <ButtonSimple margin="8px 16px" height="24px" onClick={clickLesson}>
          Subject
        </ButtonSimple>
        <ButtonSimple margin="8px 16px" height="24px" onClick={clickLesson}>
          Collection
        </ButtonSimple>
        <ButtonSimple margin="8px 16px" height="24px" onClick={clickLesson}>
          Project
        </ButtonSimple>
        <ButtonSimple margin="8px 16px" height="24px" onClick={clickLesson}>
          Resource
        </ButtonSimple>
        <ButtonSimple margin="8px 16px" height="24px" onClick={clickLesson}>
          Organization
        </ButtonSimple>
        <ButtonSimple margin="8px 16px" height="24px" onClick={clickLesson}>
          Task
        </ButtonSimple>
        <ButtonSimple margin="8px 16px" height="24px" onClick={clickLesson}>
          Portfolio Piece
        </ButtonSimple>
        <ButtonSimple margin="8px 16px" height="24px" onClick={clickLesson}>
          Help/Screenshare
        </ButtonSimple>
        <ButtonSimple margin="8px 16px" height="24px" onClick={clickLesson}>
          Event
        </ButtonSimple>
      </div>
    </Popup>
  );

  return [Element, doOpen];
}
