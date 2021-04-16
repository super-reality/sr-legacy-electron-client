import { useCallback } from "react";
import "./index.scss";
import { useDispatch } from "react-redux";
import { ReactComponent as ButtonEdit } from "../../../../../assets/svg/edit.svg";
import reduxAction from "../../../../redux/reduxAction";

interface EditAnchorButtoProps {
  anchor: string | null;
  pos: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  openEditAnchorOptions: () => void;
}

export default function EditAnchorButton(props: EditAnchorButtoProps) {
  const dispatch = useDispatch();
  const { anchor, pos, openEditAnchorOptions } = props;

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
  );
}
