import React, { useCallback, useEffect, useMemo } from "react";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as AnchorIcon } from "../../../../assets/svg/anchor.svg";
import ButtonRound from "../../button-round";
import { AppState } from "../../../redux/stores/renderer";
import usePopup from "../../../hooks/usePopup";
import ModalList from "../modal-list";
import reduxAction from "../../../redux/reduxAction";
import ButtonSimple from "../../button-simple";
import doCvMatch from "../../../../utils/doCVMatch";

export default function VideoStatus() {
  const dispatch = useDispatch();
  const { recordingData, treeAnchors, videoNavigation } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const anchor = useMemo(() => {
    return treeAnchors[recordingData.anchor || ""] || null;
  }, [treeAnchors, recordingData]);

  const [SelectAnchorPopup, doOpenAnchorPopup, close] = usePopup(false);

  const openAnchor = useCallback(
    (e) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { currentAnchor: e },
      });
    },
    [dispatch]
  );

  const setRecordingAnchor = useCallback(
    (e) => {
      reduxAction(dispatch, {
        type: "SET_RECORDING_DATA",
        arg: { anchor: e },
      });
    },
    [dispatch]
  );

  useEffect(() => {
    const videoHidden = document.getElementById(
      "video-hidden"
    ) as HTMLVideoElement;
    if (videoHidden && anchor) {
      doCvMatch(anchor.templates, videoHidden, anchor).then((arg) =>
        reduxAction(dispatch, { type: "SET_CV_RESULT", arg })
      );
    }
  }, [dispatch, anchor, videoNavigation]);

  return (
    <div className="video-status-container">
      <SelectAnchorPopup
        width="320px"
        height="400px"
        style={{ padding: "10px" }}
      >
        <ModalList
          options={Object.keys(treeAnchors).map((a) => treeAnchors[a])}
          current={recordingData.anchor || ""}
          selected={recordingData.anchor || ""}
          setCurrent={(id) => {
            setRecordingAnchor(id);
            openAnchor(id);
            close();
          }}
          open={(id) => {
            openAnchor(id);
            close();
          }}
        />
      </SelectAnchorPopup>
      <ButtonRound
        svg={AnchorIcon}
        width="28px"
        height="28px"
        style={{ margin: "auto 8px" }}
        onClick={doOpenAnchorPopup}
      />
      {anchor ? (
        <ButtonSimple
          width="140px"
          height="12px"
          margin="auto 4px"
          onClick={() => openAnchor(anchor._id)}
        >
          {anchor.name}
        </ButtonSimple>
      ) : (
        <div style={{ color: "var(--color-red)" }}>
          <i>Attach an anchor to edit</i>
        </div>
      )}
      <canvas style={{ display: "none", width: "300px" }} id="canvasOutput" />
    </div>
  );
}
