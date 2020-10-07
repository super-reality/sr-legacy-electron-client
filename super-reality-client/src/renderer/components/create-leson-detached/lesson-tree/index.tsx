import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import globalData from "../../../globalData";
import store, { AppState } from "../../../redux/stores/renderer";
import { ReactComponent as IconTreeTop } from "../../../../assets/svg/tree-drop.svg";
import { ReactComponent as IconAddAudio } from "../../../../assets/svg/add-audio.svg";
import { ReactComponent as IconAddClip } from "../../../../assets/svg/add-clip.svg";
import { ReactComponent as IconAddFocus } from "../../../../assets/svg/add-focus.svg";
import { ReactComponent as IconAddFolder } from "../../../../assets/svg/add-folder.svg";
import { ReactComponent as IconAddImage } from "../../../../assets/svg/add-image.svg";
import { ReactComponent as IconAddShare } from "../../../../assets/svg/add-share.svg";
import { ReactComponent as IconAddTeach } from "../../../../assets/svg/add-teach.svg";
import { ReactComponent as IconAddTTS } from "../../../../assets/svg/add-tts.svg";
import { ReactComponent as IconAddVideo } from "../../../../assets/svg/add-video.svg";
import { ReactComponent as TriggerIcon } from "../../../../assets/svg/item-trigger.svg";
import "./index.scss";
import reduxAction from "../../../redux/reduxAction";
import ButtonRound from "../../button-round";
import Flex from "../../flex";
import { Item } from "../../../api/types/item/item";
import { ApiError, IDName } from "../../../api/types";
import usePopupInput from "../../../hooks/usePopupInput";
import ChapterCreate from "../../../api/types/chapter/create";
import { API_URL } from "../../../constants";
import handleChapterCreate from "../../../api/handleChapterCreate";
import handleStepCreate from "../../../api/handleStepCreate";
import StepCreate from "../../../api/types/step/create";
import { TreeTypes } from "../../../redux/slices/createLessonSliceV2";

interface TreeFolderProps {
  id: string;
  parentId: string;
  name: string;
  type: "lesson" | "chapter" | "step";
  expanded?: boolean;
}

function TreeFolder(props: TreeFolderProps) {
  const { id, parentId, name, type, expanded } = props;
  const dispatch = useDispatch();
  const {
    toggleSelects,
    treeCurrentType,
    treeCurrentId,
    chapters,
    treeChapters,
    treeSteps,
  } = useSelector((state: AppState) => state.createLessonV2);

  const [open, setOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(expanded || false);
  const [selected, setSelected] = useState<boolean>(false);

  let children: IDName[] = [];
  if (type == "lesson") {
    children = chapters;
  }
  if (type == "chapter") {
    children = treeChapters[id].steps;
  }
  if (type == "step") {
    children = treeSteps[id].items;
  }

  useEffect(() => {
    const lesson = store.getState().createLessonV2;
    if (
      lesson.treeCurrentParentId !== parentId ||
      lesson.treeCurrentType !== type
    ) {
      setSelected(false);
    }
  }, [toggleSelects]);

  const doOpen = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_TREE",
      arg: { type, parentId, id },
    });
    setOpen(!open);
    setSelected(true);
  }, [dispatch, open]);

  useEffect(() => {
    setIsOpen(treeCurrentId == id && treeCurrentType == type);
  }, [treeCurrentType, treeCurrentId]);

  let padding = "0px";
  if (type == "chapter") padding = "18px";
  if (type == "step") padding = "36px";

  return (
    <>
      <div
        className={`tree-folder ${selected ? "selected" : ""} ${
          isOpen ? "open" : ""
        }`}
        onClick={doOpen}
        style={{ paddingLeft: padding }}
      >
        <div className={`folder-drop ${open ? "open" : ""}`}>
          <IconTreeTop
            style={{ margin: "auto" }}
            fill={`var(--color-${isOpen ? "green" : "icon"})`}
          />
        </div>
        <div className="folder-name">{name}</div>
      </div>
      <div
        className="tree-folder-container"
        style={{ height: open ? "auto" : "0px" }}
      >
        {children.map((ch) => {
          return type == "lesson" || type == "chapter" ? (
            <TreeFolder
              parentId={`${parentId}.${ch._id}`}
              key={ch._id}
              id={ch._id}
              name={ch.name}
              type={type == "lesson" ? "chapter" : "step"}
            />
          ) : (
            <TreeItem
              parentId={`${parentId}.${ch._id}`}
              key={ch._id}
              id={ch._id}
              name={ch.name}
            />
          );
        })}
      </div>
    </>
  );
}

interface TreeItemProps {
  id: string;
  parentId: string;
  name: string;
  expanded?: boolean;
}

function TreeItem(props: TreeItemProps) {
  const { id, parentId, name, expanded } = props;
  const dispatch = useDispatch();
  const {
    toggleSelects,
    treeCurrentType,
    treeCurrentId,
    treeItems,
  } = useSelector((state: AppState) => state.createLessonV2);
  const [selected, setSelected] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(expanded || false);

  const itemData: Item | null = treeItems[id] || null;

  const doOpen = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_TREE",
      arg: { type: "item", parentId, id },
    });
    setSelected(true);
  }, [dispatch]);

  useEffect(() => {
    const lesson = store.getState().createLessonV2;
    if (
      lesson.treeCurrentParentId !== parentId ||
      lesson.treeCurrentType !== "item"
    ) {
      setSelected(false);
    }
  }, [toggleSelects]);

  useEffect(() => {
    setIsOpen(treeCurrentId == id && treeCurrentType == "item");
  }, [treeCurrentType, treeCurrentId]);

  let Icon = IconAddFocus;
  if (itemData) {
    switch (itemData.type) {
      case "audio":
        Icon = IconAddAudio;
        break;
      case "dialog":
        Icon = IconAddClip;
        break;
      case "image":
        Icon = IconAddImage;
        break;
      case "video":
        Icon = IconAddVideo;
        break;
      default:
        Icon = IconAddFocus;
    }
  }

  return (
    <div
      className={`tree-item-container ${selected ? "selected" : ""} ${
        isOpen ? "open" : ""
      }`}
      onClick={doOpen}
      style={{ paddingLeft: "36px" }}
    >
      <div className="item-icon-tree">
        <Icon style={{ margin: "auto" }} fill="var(--color-icon)" />
      </div>
      <div className="item-name">{name}</div>
      <div className="item-trigger">
        {itemData && itemData.trigger && (
          <TriggerIcon width="14px" height="14px" fill="var(--color-icon)" />
        )}
      </div>
    </div>
  );
}

export default function LessonTree() {
  const { name, chapters, _id } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  return (
    <Flex column style={{ overflow: "auto" }}>
      <TreeFolder
        parentId={`${_id}`}
        id={_id}
        name={name}
        expanded
        type="lesson"
      />
    </Flex>
  );
}

export function LessonTreeControls() {
  const dispatch = useDispatch();
  const { treeCurrentType, treeCurrentId } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  let childType: TreeTypes = "chapter";
  if (treeCurrentType == "chapter") childType = "step";
  if (treeCurrentType == "step") childType = "item";

  const doAddFolder = useCallback(
    (name: string) => {
      // Create chapter
      if (childType == "chapter") {
        const payload = {
          name,
        };
        Axios.post<ChapterCreate | ApiError>(
          `${API_URL}chapter/create`,
          payload
        )
          .then(handleChapterCreate)
          .then((data) => {
            reduxAction(dispatch, {
              type: "CREATE_LESSON_V2_SETCHAPTER",
              arg: data,
            });
          })
          .catch(console.error);
      }
      // Create step
      if (childType == "step") {
        const payload = {
          name,
        };
        Axios.post<StepCreate | ApiError>(`${API_URL}step/create`, payload)
          .then(handleStepCreate)
          .then((data) => {
            reduxAction(dispatch, {
              type: "CREATE_LESSON_V2_SETSTEP",
              arg: { step: data, chapter: treeCurrentId },
            });
          })
          .catch(console.error);
      }
    },
    [treeCurrentType, treeCurrentId, dispatch]
  );

  const doAddFocus = useCallback(() => {
    //
  }, [treeCurrentType]);

  const [FolderInput, openNewFolderInput] = usePopupInput(
    `Enter new ${childType} name:`,
    doAddFolder
  );

  return (
    <Flex style={{ margin: "8px 0" }}>
      <FolderInput />
      {treeCurrentType == "lesson" || treeCurrentType == "chapter" ? (
        <ButtonRound
          onClick={openNewFolderInput}
          svg={IconAddFolder}
          width="32px"
          height="32px"
        />
      ) : (
        <>
          <ButtonRound
            onClick={doAddFocus}
            svg={IconAddFocus}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={doAddFocus}
            svg={IconAddTTS}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={doAddFocus}
            svg={IconAddImage}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={doAddFocus}
            svg={IconAddVideo}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={doAddFocus}
            svg={IconAddTeach}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={doAddFocus}
            svg={IconAddAudio}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={doAddFocus}
            svg={IconAddClip}
            width="32px"
            height="32px"
            style={{ margin: "0 4px" }}
          />
          <ButtonRound
            onClick={doAddFocus}
            svg={IconAddShare}
            width="32px"
            height="32px"
            style={{ margin: "0 0 0 4px" }}
          />
        </>
      )}
    </Flex>
  );
}
