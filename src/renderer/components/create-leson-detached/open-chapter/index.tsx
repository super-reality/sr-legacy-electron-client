import { useCallback } from "react";

import { useDispatch } from "react-redux";
import reduxAction from "../../../redux/reduxAction";
import ButtonSimple from "../../button-simple";

import { ReactComponent as IconInfo } from "../../../../assets/svg/information.svg";
import { ReactComponent as IconGenerate } from "../../../../assets/svg/generate-steps.svg";

import { ReactComponent as IconAchievements } from "../../../../assets/svg/skill-achievement.svg";
import { ReactComponent as IconAlerts } from "../../../../assets/svg/alerts.svg";

export default function OpenChapter() {
  const dispatch = useDispatch();

  const openPanel = useCallback(
    (panel: string) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { openPanel: panel },
      });
    },
    [dispatch]
  );

  const style = {
    padding: "0px 15px",
    background: "#2e2a48",
    margin: "3.5px 0",
    width: "90%",
    height: "40px",
    justifyContent: "left",
    color: "#8A88C3",
  };

  return (
    <>
      <ButtonSimple
        style={style}
        onClick={() => openPanel("chapter-information")}
      >
        <IconInfo />
        Information
      </ButtonSimple>

      <ButtonSimple style={style} onClick={() => openPanel("chapter-skills")}>
        <IconAchievements />
        Skills and achievements
      </ButtonSimple>
      <ButtonSimple style={style} onClick={() => openPanel("chapter-alerts")}>
        <IconAlerts />
        Alerts
      </ButtonSimple>
      <ButtonSimple
        style={style}
        onClick={() => openPanel("generate-recording")}
      >
        <IconGenerate />
        Generate Steps
      </ButtonSimple>
    </>
  );
}
