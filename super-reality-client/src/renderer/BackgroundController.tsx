import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import initializeBackground from "../background/initializeBackground";
import ipcSend from "../utils/ipcSend";
import CvComponents from "./components/CvComponents";
import useCVMatch from "./hooks/useCVMatch";
import reduxAction from "./redux/reduxAction";
import { AppState } from "./redux/stores/renderer";

export default function BackgroundController(): JSX.Element {
  const dispatch = useDispatch();
  const [processingCv, setProcessingCv] = useState<boolean>(false);
  const { cvTemplates, cvTo, anchorId } = useSelector(
    (state: AppState) => state.background
  );
  const [sendTo, setSendTo] = useState("");

  const cvCallback = useCallback(
    (arg) => {
      setProcessingCv(false);
      ipcSend({
        method: "cvResult",
        arg: { ...arg, id: anchorId },
        to: sendTo,
      });
    },
    [sendTo, anchorId, dispatch]
  );

  const [CV, _isCapturing, _startCV, _endCV, doMatch] = useCVMatch(
    cvTemplates,
    cvCallback
  );

  useEffect(() => {
    initializeBackground();
  }, []);

  useEffect(() => {
    if (cvTo !== "") {
      setSendTo(cvTo);
      reduxAction(dispatch, { type: "SET_BACK", arg: { cvTo: "" } });
      if (!processingCv) {
        setProcessingCv(true);
        doMatch();
      }
    }
  }, [processingCv, doMatch, cvTo]);

  return (
    <>
      <CvComponents />
      <CV />
    </>
  );
}
