import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import store, { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";
import { Item } from "../../../api/types/item/item";
import { IDName } from "../../../api/types";
import Flex from "../../flex";
import onDrag from "../lesson-utils/onDrag";
import onDrop from "../lesson-utils/onDrop";
import getLesson from "../lesson-utils/getLesson";
import getChapter from "../lesson-utils/getChapter";
import getStep from "../lesson-utils/getStep";

import "./index.scss";
import { ReactComponent as IconTreeTop } from "../../../../assets/svg/tree-drop.svg";
import { ReactComponent as IconAddAudio } from "../../../../assets/svg/add-audio.svg";
import { ReactComponent as IconAddClip } from "../../../../assets/svg/add-clip.svg";
import { ReactComponent as IconAddFocus } from "../../../../assets/svg/add-focus.svg";
import { ReactComponent as IconAddImage } from "../../../../assets/svg/add-image.svg";
import { ReactComponent as IconAddVideo } from "../../../../assets/svg/add-video.svg";
import { ReactComponent as TriggerIcon } from "../../../../assets/svg/item-trigger.svg";
import onDragOver from "../lesson-utils/onDragOver";
import onDelete from "../lesson-utils/onDelete";

const STATE_ERR = -1;
const STATE_IDLE = 0;
const STATE_LOADING = 1;
const STATE_OK = 2;
const STATE_CUT = 3;

type STATES =
  | typeof STATE_ERR
  | typeof STATE_IDLE
  | typeof STATE_LOADING
  | typeof STATE_OK
  | typeof STATE_CUT;

interface TreeFolderProps {
  id: string;
  parentId: string;
  uniqueId: string;
  name: string;
  type: "lesson" | "chapter" | "step";
  expanded?: boolean;
}

function TreeFolder(props: TreeFolderProps) {
  const { id, parentId, uniqueId, name, type, expanded } = props;
  const dispatch = useDispatch();
  const {
    toggleSelects,
    treeCurrentType,
    treeCurrentId,
    treeLessons,
    treeChapters,
    treeSteps,
    dragOver,
  } = useSelector((state: AppState) => state.createLessonV2);

  const [open, setOpen] = useState<boolean>(false);
  const [state, setState] = useState<STATES>(STATE_IDLE);
  const [isOpen, setIsOpen] = useState<boolean>(expanded || false);
  const [selected, setSelected] = useState<boolean>(false);

  let children: IDName[] = [];
  if (type == "lesson") {
    children = treeLessons[id]?.chapters || [];
  }
  if (type == "chapter") {
    children = treeChapters[id]?.steps || [];
  }
  if (type == "step") {
    children = treeSteps[id]?.items || [];
  }

  useEffect(() => {
    if (type == "lesson") {
      setState(STATE_LOADING);
      getLesson(id)
        .then((data) => {
          reduxAction(store.dispatch, {
            type: "CREATE_LESSON_V2_SETLESSON",
            arg: data,
          });
          setState(STATE_OK);
        })
        .catch((e) => setState(STATE_ERR));
    }
    if (type == "chapter" && treeChapters[id] == undefined) {
      setState(STATE_OK);
      getChapter(id)
        .then((data) => {
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_SETCHAPTER",
            arg: { chapter: data },
          });
          setState(STATE_OK);
        })
        .catch((e) => setState(STATE_ERR));
    }
    if (type == "step" && treeSteps[id] == undefined) {
      setState(STATE_OK);
      getStep(id)
        .then((data) => {
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_SETSTEP",
            arg: { step: data },
          });
          setState(STATE_OK);
        })
        .catch((e) => setState(STATE_ERR));
    }
  }, [dispatch, id]);

  const keyListeners = useCallback((e: KeyboardEvent) => {
    if (e.key === "Delete") {
      onDelete(type, id, parentId);
    }
    if (e.ctrlKey && e.key === "c") {
      console.log(`copy ${id}`);
    }
    if (e.ctrlKey && e.key === "x") {
      console.log(`cut ${id}`);
    }
    if (e.ctrlKey && e.key === "v") {
      console.log(`paste on ${id}`);
    }
  }, []);

  useEffect(() => {
    const lesson = store.getState().createLessonV2;
    if (
      lesson.treeCurrentUniqueId !== uniqueId ||
      lesson.treeCurrentType !== type
    ) {
      setSelected(false);
    }
  }, [toggleSelects]);

  const doOpen = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (!e.ctrlKey) {
        reduxAction(dispatch, {
          type: "CREATE_LESSON_V2_TREE",
          arg: { type, uniqueId, id },
        });
        setOpen(!open);
      }
      document.onkeydown = keyListeners;
      setSelected(true);
    },
    [dispatch, open]
  );

  useEffect(() => {
    setIsOpen(treeCurrentId == id && treeCurrentType == type);
  }, [treeCurrentType, treeCurrentId]);

  let padding = "0px";
  if (type == "chapter") padding = "18px";
  if (type == "step") padding = "36px";

  return (
    <>
      <div
        draggable
        onDrag={(e) => onDrag(e, type, id, parentId)}
        onDrop={(e) => onDrop(e, type, id, parentId)}
        onDragOver={(e) => onDragOver(e, uniqueId)}
        className={`tree-folder ${selected ? "selected" : ""} ${
          isOpen ? "open" : ""
        } ${dragOver == uniqueId ? "drag-target" : ""}`}
        onClick={doOpen}
        style={{ paddingLeft: padding }}
      >
        <div className={`folder-drop ${open ? "open" : ""}`}>
          <IconTreeTop
            style={{ margin: "auto" }}
            fill={`var(--color-${isOpen ? "green" : "icon"})`}
          />
        </div>
        <div
          className={`folder-name ${
            state == STATE_LOADING ? "tree-loading" : ""
          }`}
        >
          {name}
        </div>
      </div>
      <div
        className="tree-folder-container"
        style={{ height: open ? "auto" : "0px" }}
      >
        {children.map((ch) => {
          return type == "lesson" || type == "chapter" ? (
            <TreeFolder
              parentId={id}
              uniqueId={`${uniqueId}.${ch._id}`}
              key={ch._id}
              id={ch._id}
              name={ch.name}
              type={type == "lesson" ? "chapter" : "step"}
            />
          ) : (
            <TreeItem
              parentId={id}
              uniqueId={`${parentId}.${ch._id}`}
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
  uniqueId: string;
  name: string;
  expanded?: boolean;
}

function TreeItem(props: TreeItemProps) {
  const { id, parentId, uniqueId, name, expanded } = props;
  const dispatch = useDispatch();
  const {
    toggleSelects,
    treeCurrentType,
    treeCurrentId,
    treeItems,
    dragOver,
  } = useSelector((state: AppState) => state.createLessonV2);
  const [selected, setSelected] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(expanded || false);
  const [state, setState] = useState<STATES>(STATE_IDLE);

  const itemData: Item | null = treeItems[id] || null;

  const keyListeners = useCallback((e: KeyboardEvent) => {
    if (e.key === "Delete") {
      onDelete("item", id, parentId);
    }
    if (e.ctrlKey && e.key === "c") {
      console.log(`copy ${id}`);
    }
    if (e.ctrlKey && e.key === "x") {
      console.log(`cut ${id}`);
    }
    if (e.ctrlKey && e.key === "v") {
      console.log(`paste on ${id}`);
    }
  }, []);

  const doOpen = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_TREE",
      arg: { type: "item", uniqueId, id },
    });
    document.onkeydown = keyListeners;
    setSelected(true);
  }, [dispatch]);

  useEffect(() => {
    const lesson = store.getState().createLessonV2;
    if (
      lesson.treeCurrentUniqueId !== uniqueId ||
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
      onDrag={(e) => onDrag(e, "item", id, parentId)}
      onDrop={(e) => onDrop(e, "item", id, parentId)}
      onDragOver={(e) => onDragOver(e, uniqueId)}
      className={`tree-item-container ${selected ? "selected" : ""} ${
        isOpen ? "open" : ""
      } ${dragOver == uniqueId ? "drag-target" : ""}`}
      onClick={doOpen}
      style={{ paddingLeft: "36px" }}
    >
      <div className="item-icon-tree">
        <Icon style={{ margin: "auto" }} fill="var(--color-icon)" />
      </div>
      <div
        className={`item-name ${state == STATE_LOADING ? "tree-loading" : ""}`}
      >
        {name}
      </div>
      <div className="item-trigger">
        {itemData && itemData.trigger && (
          <TriggerIcon width="14px" height="14px" fill="var(--color-icon)" />
        )}
      </div>
    </div>
  );
}

export default function LessonTree() {
  const { lessons } = useSelector((state: AppState) => state.createLessonV2);

  return (
    <Flex column style={{ overflow: "auto" }}>
      {lessons.map((d) => (
        <TreeFolder
          uniqueId={`${d._id}`}
          parentId=""
          key={`${d._id}`}
          id={d._id}
          name={d.name}
          expanded
          type="lesson"
        />
      ))}
    </Flex>
  );
}
