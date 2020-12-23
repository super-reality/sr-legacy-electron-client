import React, { useCallback } from "react";
import "./index.scss";
import { useDispatch } from "react-redux";
import { ReactComponent as ButtonEdit } from "../../../../../assets/svg/edit.svg";
import reduxAction from "../../../../redux/reduxAction";
import { PreviewModes } from "../../../../redux/slices/createLessonSliceV2";
import Flex from "../../../flex";
import ButtonSimple from "../../../button-simple";
import usePopup from "../../../../hooks/usePopup";

interface EditAnchorButtoProps {
  anchor: string | null;
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export default function EditAnchorButton(props: EditAnchorButtoProps) {
  const dispatch = useDispatch();
  const { anchor, pos } = props;

  const [
    EditAnchorOptions,
    openEditAnchorOptions,
    closeEditAnchorOptions,
  ] = usePopup(false);

  const setPreviewMode = useCallback(
    (mode: PreviewModes) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: { previewMode: mode },
      });
      closeEditAnchorOptions();
    },
    [closeEditAnchorOptions, dispatch]
  );

  const onClick = useCallback(() => {
    openEditAnchorOptions();
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_DATA",
      arg: {
        editingAnchor: anchor || "",
        previewEditArea: {
          ...pos,
        },
      },
    });
  }, [openEditAnchorOptions, dispatch, anchor, pos]);

  return (
    <>
      <EditAnchorOptions width="540px" height="240px">
        <Flex style={{ justifyContent: "center", margin: "0 auto 16px auto" }}>
          Choose one
        </Flex>
        <Flex style={{ justifyContent: "space-evenly", marginBottom: "16px" }}>
          <ButtonSimple
            width="100px"
            height="16px"
            onClick={() => setPreviewMode("CREATE_ANCHOR")}
          >
            Create new
          </ButtonSimple>
          <ButtonSimple
            width="100px"
            height="16px"
            onClick={() => setPreviewMode("ADDTO_ANCHOR")}
          >
            Add to current
          </ButtonSimple>
          <ButtonSimple
            width="100px"
            height="16px"
            onClick={() => setPreviewMode("IDLE")}
          >
            Cancel
          </ButtonSimple>
        </Flex>
      </EditAnchorOptions>
      <div
        className="edit-anchor-button-hover"
        style={{
          left: `${pos.x - 64}px`,
          top: `${pos.y - 64}px`,
          width: `${pos.width + 128}px`,
          height: `${pos.height + 128}px`,
        }}
      >
        <div className="edit-anchor-button" onClick={onClick}>
          <ButtonEdit
            style={{
              width: "16px",
              height: "16px",
              margin: "auto",
              fill: "var(--color-icon)",
            }}
          />
        </div>
      </div>
    </>
  );
}
