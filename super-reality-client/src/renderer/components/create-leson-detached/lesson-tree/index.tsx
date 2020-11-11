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
import getItem from "../lesson-utils/getItem";
import getAnchor from "../lesson-utils/getAnchor";

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

  let exp = expanded;
  if (window.localStorage.getItem(id) !== null) {
    exp = window.localStorage.getItem(id) == "true";
  }

  const [open, setOpen] = useState<boolean>(exp || false);
  const [state, setState] = useState<STATES>(STATE_IDLE);
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
    if (state !== STATE_IDLE) return;
    const slice = store.getState().createLessonV2;
    if (type == "lesson" && slice.treeLessons[id] == undefined) {
      // console.log(type, id, !!slice.treeLessons[id], state);
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
    if (type == "chapter" && slice.treeChapters[id] == undefined) {
      // console.log(type, id, !!slice.treeChapters[id], state);
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
    if (type == "step" && slice.treeSteps[id] == undefined) {
      // console.log(type, id, !!slice.treeSteps[id], state);
      setState(STATE_OK);
      getStep(id)
        .then((data) => {
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_SETSTEP",
            arg: { step: data },
          });
          setState(STATE_OK);
          if (
            data.anchor &&
            store.getState().createLessonV2.treeAnchors[data.anchor] ==
              undefined
          ) {
            getAnchor(data.anchor).then((anchor) => {
              reduxAction(store.dispatch, {
                type: "CREATE_LESSON_V2_SETANCHOR",
                arg: { anchor: anchor },
              });
            });
          }
        })
        .catch((e) => setState(STATE_ERR));
    }
  }, [dispatch, state, id]);

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
        if (id && type == "step") {
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_DATA",
            arg: {
              currentLesson: uniqueId.split(".")[0],
              currentChapter: parentId,
              currentStep: id,
              currentItem: undefined,
            },
          });
        }
        if (id && type == "chapter") {
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_DATA",
            arg: {
              currentLesson: parentId,
              currentChapter: id,
              currentItem: undefined,
            },
          });
        }
        if (id && type == "lesson") {
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_DATA",
            arg: {
              currentLesson: id,
              currentChapter: undefined,
              currentItem: undefined,
            },
          });
        }
        setOpen(!open);
        setTimeout(() => {
          window.localStorage.setItem(id, !open ? "true" : "false");
        }, 100);
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
              uniqueId={`${uniqueId}.${ch._id}`}
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
    treeSteps,
    dragOver,
  } = useSelector((state: AppState) => state.createLessonV2);
  const [selected, setSelected] = useState<boolean>(false);
  const [state, setState] = useState<STATES>(STATE_IDLE);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const itemData: Item | null = treeItems[id] || null;

  useEffect(() => {
    if (state !== STATE_IDLE) return;
    const slice = store.getState().createLessonV2;
    if (slice.treeItems[id] == undefined) {
      // console.log("item", id, !!slice.treeItems[id], state);
      setState(STATE_LOADING);
      getItem(id)
        .then((data) => {
          reduxAction(dispatch, {
            type: "CREATE_LESSON_V2_SETITEM",
            arg: { item: data },
          });
          setState(STATE_OK);
        })
        .catch((e) => setState(STATE_ERR));
    }
  }, [dispatch, id, state]);

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
    if (id) {
      const parentAnchor = treeSteps[parentId].anchor || undefined;
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: {
          currentLesson: uniqueId.split(".")[0],
          currentChapter: uniqueId.split(".")[1],
          currentStep: parentId,
          currentAnchor: parentAnchor,
          currentItem: id,
        },
      });
    }
    document.onkeydown = keyListeners;
    setSelected(true);
  }, [dispatch, id]);

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
      onClick={state == STATE_OK || state == STATE_IDLE ? doOpen : undefined}
      style={{ paddingLeft: "56px" }}
    >
      <div className="item-icon-tree">
        <Icon style={{ margin: "auto" }} fill="var(--color-icon)" />
      </div>
      <div
        className={`item-name ${state == STATE_LOADING ? "tree-loading" : ""}`}
      >
        {itemData?.name || itemData?.type || name}
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
          type="lesson"
        />
      ))}
    </Flex>
  );
}
