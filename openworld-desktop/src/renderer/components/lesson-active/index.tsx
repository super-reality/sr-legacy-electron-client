import React, { useCallback } from "react";
import "./index.scss";
import "../popups.scss";
import { ItemInner, Icon, Title, Social } from "../item-inner";
import { ILessonData } from "../../../types/api";
import usePopup from "../../hooks";

interface LessonActiveProps {
  data: ILessonData;
}

export default function LessonActive(props: LessonActiveProps) {
  const { data } = props;

  const [YesNoPopup, open, close] = usePopup(false);

  const clickYes = useCallback(() => {
    close();
    console.log("You clicked yes!");
  }, [close]);

  return (
    <ItemInner>
      <YesNoPopup width="300px" height="250px">
        <div className="popup-title">Add to your lessons?</div>
        <div className="popup-modal">
          <div className="modal-yes" onClick={clickYes}>
            Yes
          </div>
          <div className="modal-no" onClick={close}>
            No
          </div>
        </div>
      </YesNoPopup>
      <Icon url={data.avatarUrl} />
      <Title title={data.name} sub={data.creator} />
      <Social
        rating={data.rating}
        share="http://someurl.com"
        checked
        checkButtonCallback={open}
      />
    </ItemInner>
  );
}
