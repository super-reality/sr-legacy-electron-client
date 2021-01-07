import React, { useCallback } from "react";
import "./index.scss";

import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as EditButton } from "../../../assets/svg/edit.svg";
import useAnchor from "../create-leson-detached/hooks/useAnchor";
import reduxAction from "../../redux/reduxAction";
import store, { AppState } from "../../redux/stores/renderer";
import { PreviewModes } from "../../redux/slices/createLessonSliceV2";
import updateAnchor from "../create-leson-detached/lesson-utils/updateAnchor";
import userDataPath from "../../../utils/files/userDataPath";
import saveCanvasImage from "../../../utils/saveCanvasImage";
import cropImage from "../../../utils/cropImage";
import setStatus from "../create-leson-detached/lesson-utils/setStatus";
import { IAnchor } from "../../api/types/anchor/anchor";
import uploadFileToS3 from "../../../utils/api/uploadFileToS3";
import newAnchor from "../create-leson-detached/lesson-utils/newAnchor";

// import editStepItemsRelativePosition from "../create-leson-detached/lesson-utils/editStepItemsRelativePosition";

interface AnchorCommandsProps {
  anchorId: string;
  template: number;
}

function doNewAnchor(url: string) {
  return newAnchor({
    name: "New Anchor",
    type: "crop",
    templates: [url],
    anchorFunction: "or",
    cvMatchValue: 990,
    cvCanvas: 100,
    cvDelay: 50,
    cvGrayscale: true,
    cvApplyThreshold: false,
    cvThreshold: 127,
  });
}

function newAnchorPre(file: string): Promise<IAnchor | undefined> {
  if (file.indexOf("http") == -1) {
    return uploadFileToS3(file).then(doNewAnchor);
  }
  return doNewAnchor(file);
}

export default function AnchorCommands(props: AnchorCommandsProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { anchorId, template } = props;
  const { cvResult } = useSelector((state: AppState) => state.render);
  const { previewMode, videoNavigation, previewEditArea } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const dispatch = useDispatch();

  const userData = userDataPath();
  const captureFileName = `${userData}/capture.png`;

  const anchor = useAnchor(anchorId);

  const setPreviewMode = useCallback(
    (mode: PreviewModes) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { previewMode: mode },
      });
    },
    [dispatch]
  );

  const editAddToCurrentAnchor = useCallback(
    (fileName: string) => {
      uploadFileToS3(fileName)
        .then(
          (newUrl): Promise<IAnchor | undefined> => {
            const slice = store.getState().createLessonV2;
            const a: IAnchor | null = slice.treeAnchors[anchorId];
            return updateAnchor(
              { templates: [...a.templates, newUrl] },
              anchorId
            ).then((updatedAnchor) => {
              if (updatedAnchor) {
                reduxAction(dispatch, {
                  type: "CREATE_LESSON_V2_SETANCHOR",
                  arg: { anchor: updatedAnchor },
                });
              }
              return updatedAnchor;
            });
          }
        )
        .then(() => setPreviewMode("IDLE"))
        .catch((e) => {
          console.error(e);
          setPreviewMode("IDLE");
        });
    },
    [anchorId, setPreviewMode]
  );

  const editCreateNewAnchor = useCallback(
    (fileName: string) => {
      newAnchorPre(fileName)
        /*
        .then(
          (a): Promise<IStep | undefined> => {
            if (a) {
              const newTimestamp = timetoTimestamp(videoNavigation[1]);
              saveCanvasImage(`${itemsPath}/${sha1(newTimestamp)}.png`)
                .then((file) => uploadFileToS3(file))
                .then((url) => {
                  return updateStep(
                    {
                      anchor: a._id,
                      recordingTimestamp: newTimestamp,
                      snapShot: url,
                    },
                    currentStep
                  ).then((updatedStep) => {
                    if (updatedStep) {
                      reduxAction(dispatch, {
                        type: "CREATE_LESSON_V2_SETSTEP",
                        arg: { step: updatedStep },
                      });
                    }
                    return updatedStep;
                  });
                });
            }
            return new Promise((r) => r(undefined));
          }
        )
        */
        .then(() => setPreviewMode("IDLE"))
        .catch((e) => {
          console.error(e);
          setPreviewMode("IDLE");
        });
    },
    [videoNavigation, dispatch, setPreviewMode]
  );

  const doFinishEditAnchor = useCallback(() => {
    saveCanvasImage(captureFileName)
      .then((image) => cropImage(image, previewEditArea))
      .then((file) => {
        if (previewMode == "CREATE_ANCHOR") {
          setStatus("Creating new anchor");
          editCreateNewAnchor(file);
        }
        if (previewMode == "EDIT_ANCHOR") {
          setStatus("Editing anchor");
          editAddToCurrentAnchor(file);
        }
        if (previewMode == "ADDTO_ANCHOR") {
          setStatus("Adding to anchor");
          editAddToCurrentAnchor(file);
        }
      });
  }, [previewMode, previewEditArea, cvResult]);

  const _doEditTemplate = useCallback(() => {
    //
  }, [anchor, anchorId, dispatch, setPreviewMode]);

  const doAddTemplate = useCallback(() => {
    setPreviewMode("ADDTO_ANCHOR");
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        editingAnchor: anchorId || "",
        previewEditArea: {
          ...cvResult,
        },
      },
    });
  }, [anchor, anchorId, dispatch, setPreviewMode]);

  const doRemoveTemplate = useCallback(() => {
    if (!anchor) return;
    if (anchor.templates.length == 1) {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DELETEANCHOR",
        arg: { anchorId },
      });
    } else {
      const templates = [...anchor.templates].splice(template, 1);
      updateAnchor({ templates }, anchorId).then((udpated) => {
        if (udpated) {
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_SETANCHOR",
            arg: { anchor: udpated },
          });
        }
      });
    }
  }, [anchor, anchorId]);

  return (
    <div className="anchor-commands-container">
      {previewMode == "IDLE" && (
        <>
          <EditButton
            className="button"
            width="16px"
            height="16px"
            fill="#E78C31"
            onClick={doAddTemplate}
          />
          <EditButton
            className="button"
            width="16px"
            height="16px"
            fill="#04AFF0"
            onClick={doAddTemplate}
          />
          <EditButton
            className="button"
            width="16px"
            height="16px"
            fill="#F1205F"
            onClick={doRemoveTemplate}
          />
        </>
      )}
      {previewMode == "ADDTO_ANCHOR" && (
        <>
          <EditButton
            className="button"
            width="16px"
            height="16px"
            fill="#00FF3C"
            onClick={doFinishEditAnchor}
          />
          <EditButton
            className="button"
            width="16px"
            height="16px"
            fill="#FF004D"
            onClick={() => setPreviewMode("IDLE")}
          />
        </>
      )}
    </div>
  );
}
