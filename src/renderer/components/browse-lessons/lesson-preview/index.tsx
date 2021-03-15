import React, { useCallback } from "react";
import "./index.scss";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ReactComponent as ThreeDots } from "../../../../assets/svg/three-dots.svg";
import useLesson from "../../create-leson-detached/hooks/useLesson";
import reduxAction from "../../../redux/reduxAction";
import useDropdown from "../../../hooks/useDropdown";
import usePopupInput from "../../../hooks/usePopupInput";
import updateLesson from "../../create-leson-detached/lesson-utils/updateLesson";
import usePopupModal from "../../../hooks/usePopupModal";
import deleteGeneric from "../../create-leson-detached/lesson-utils/deleteGeneric";
import store from "../../../redux/stores/renderer";

import { ReactComponent as VisibilityIcon } from "../../../../assets/svg/public.svg";

interface LessonPreviewProps {
  id: string;
}

export default function LessonPreview(props: LessonPreviewProps) {
  const { id } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const lesson = useLesson(id);

  const onClick = useCallback(() => {
    if (lesson) {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: {
          lessons: [
            {
              _id: id,
              name: lesson.name,
            },
          ],
        },
      });
    }

    history.push(`/lesson/create/${id}`);
  }, [history, lesson, dispatch]);

  const [RenamePopup, openRename] = usePopupInput(
    "Rename:",
    (name: string) => {
      updateLesson({ name }, id).then((updatedLesson) => {
        if (updatedLesson) {
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_SETLESSON",
            arg: updatedLesson,
          });
        }
      });
    },
    lesson?.name
  );

  const togglePublic = useCallback(() => {
    if (lesson) {
      updateLesson({ visibility: lesson.visibility == 1 ? 0 : 1 }, id).then(
        (updatedLesson) => {
          if (updatedLesson) {
            reduxAction(dispatch, {
              type: "CREATE_LESSON_V2_SETLESSON",
              arg: updatedLesson,
            });
          }
        }
      );
    }
  }, [dispatch, lesson]);

  const [PopupModal, openDeleteModal] = usePopupModal(
    "Are you sure? This cannot be undone.",
    () => {
      deleteGeneric("lesson", id).then(() => {
        const { lessons } = store.getState().userData;
        const newLessons = [...lessons];
        newLessons.splice(lessons.indexOf(id), 1);
        reduxAction(dispatch, {
          type: "USERDATA_SET_LESSONS",
          arg: newLessons,
        });
      });
    }
  );

  const dropdownClick = useCallback(
    (selected: string) => {
      if (selected == "Open") {
        onClick();
      }
      if (selected == "Rename") {
        openRename();
      }
      if (selected == "Delete") {
        openDeleteModal();
      }
    },
    [onClick, openRename, openDeleteModal]
  );

  const [Dropdown, setOpen] = useDropdown(
    [{ title: "Open" }, { title: "Rename" }, { title: "Delete" }],
    dropdownClick
  );

  return (
    <div className="lesson-preview">
      <PopupModal />
      <RenamePopup />
      <div className="image" onClick={onClick}>
        <div
          className={`visibility-icon ${
            lesson?.visibility == 1 ? "public" : "private"
          }`}
          onClick={(e) => {
            togglePublic();
            e.stopPropagation();
          }}
        >
          <VisibilityIcon />
        </div>
      </div>

      {lesson ? (
        <>
          <div className="title-container">
            <div className="title">{lesson.name}</div>
            <div
              className="options-button"
              onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                e.stopPropagation();
                setOpen(
                  e.currentTarget.offsetLeft + 9,
                  e.currentTarget.offsetTop + 13
                );
              }}
            >
              <ThreeDots fill="var(--color-icon)" />
              <Dropdown />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

interface LessonPreviewAdd {
  onClick: () => void;
}

export function LessonPreviewAdd(props: LessonPreviewAdd) {
  const { onClick } = props;

  return (
    <div className="lesson-preview" onClick={onClick}>
      <div className="image-add" />
      <div className="title-container">
        <div className="title">Create New</div>
      </div>
    </div>
  );
}
