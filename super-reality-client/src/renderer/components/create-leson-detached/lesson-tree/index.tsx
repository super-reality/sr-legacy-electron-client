import { useDispatch, useSelector } from "react-redux";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import store, { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";
import { Item } from "../../../items/item";
import { IDName } from "../../../api/types";
import Flex from "../../flex";
import onDrag from "../lesson-utils/onDrag";
import onDrop from "../lesson-utils/onDrop";
import getLesson from "../lesson-utils/getLesson";
import getChapter from "../lesson-utils/getChapter";
import getStep from "../lesson-utils/getStep";

import "./index.scss";
import { ReactComponent as IconTreeTop } from "../../../../assets/svg/tree-drop.svg";
import { ReactComponent as TriggerIcon } from "../../../../assets/svg/item-trigger.svg";
import onDragOver from "../lesson-utils/onDragOver";
import onDelete from "../lesson-utils/onDelete";
import getItem from "../lesson-utils/getItem";
import getAnchor from "../lesson-utils/getAnchor";
import getItemIcon from "../../../items/getItemIcon";
import idNamePos from "../../../../utils/idNamePos";
import { addKeyDownListener } from "../../../../utils/globalKeyListeners";

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
  tabIndex: number;
  siblings: IDName[];
}

function TreeFolder(props: TreeFolderProps) {
  const {
    id,
    siblings,
    parentId,
    uniqueId,
    name,
    type,
    expanded,
    tabIndex,
  } = props;
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

  const treeRef = useRef<HTMLDivElement>(null);

  // Converted to Memo to be used on the arrow movement function
  // Else its value could change and the callback would not be updated
  const [children, dataName] = useMemo((): [IDName[], string | undefined] => {
    let child: IDName[] = [];
    let cname: string | undefined;
    if (type == "lesson") {
      child = treeLessons[id]?.chapters || [];
      cname = treeLessons[id]?.name;
    }
    if (type == "chapter") {
      child = treeChapters[id]?.steps || [];
      cname = treeChapters[id]?.name;
    }
    if (type == "step") {
      child = treeSteps[id]?.items || [];
      cname = treeSteps[id]?.name;
    }

    return [child, cname];
  }, [id, treeLessons, treeChapters, treeSteps]);

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
        .catch(() => setState(STATE_ERR));
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
        .catch(() => setState(STATE_ERR));
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
        .catch(() => setState(STATE_ERR));
    }
  }, [dispatch, state, id]);

  const keyUpDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      let findId = "";
      if (e.key === "ArrowDown") {
        const nextIdx = tabIndex + 1;
        if (nextIdx > siblings.length - 1) {
          // Go to next parent
          const slice = store.getState().createLessonV2;
          if (type == "chapter" && slice.currentLesson) {
            const parentSiblings = slice.lessons;
            const pos = idNamePos(parentSiblings, slice.currentLesson);
            if (pos + 1 < parentSiblings.length) {
              findId = parentSiblings[pos + 1]._id;
            } else {
              findId = id;
            }
          }
          if (type == "step") {
            const grandpa = uniqueId.split(".")[0];
            const parentSiblings = slice.treeLessons[grandpa].chapters;
            const pos = idNamePos(parentSiblings, parentId);
            if (pos + 1 < parentSiblings.length) {
              findId = parentSiblings[pos + 1]._id;
            } else {
              findId = id;
            }
          }
        } else {
          // Go to next sibling
          findId = siblings[nextIdx]._id;

          if (open && children && children.length > 0) {
            findId = children[0]?._id;
          }
        }
      } else {
        const nextIdx = tabIndex - 1;
        if (nextIdx < 0) {
          // Go to parent
          findId = parentId;
        } else {
          // Go to previous sibling
          findId = siblings[nextIdx]._id;
        }
      }

      if (findId !== "") {
        const div = document.getElementById(findId);
        setSelected(false);
        if (div) div.click();
      }
    },
    [id, tabIndex, children, selected, open, siblings]
  );

  const regenKeyListeners = useCallback(() => {
    if (!selected) return;
    addKeyDownListener("Delete", () => {
      onDelete(type, id, parentId);
    });

    addKeyDownListener("ArrowLeft", () => {
      if (open) setOpen(false);
    });

    addKeyDownListener("ArrowRight", () => {
      if (!open) setOpen(true);
    });

    addKeyDownListener("ArrowUp", keyUpDown);
    addKeyDownListener("ArrowDown", keyUpDown);
  }, [id, keyUpDown]);

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
              currentStep: undefined,
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
              currentStep: undefined,
              currentItem: undefined,
            },
          });
        }
        reduxAction(dispatch, {
          type: "CREATE_LESSON_V2_TREE",
          arg: { type, uniqueId, id },
        });
        if (e.isTrusted) {
          setOpen(!open);
        }
        setTimeout(() => {
          window.localStorage.setItem(id, !open ? "true" : "false");
        }, 100);
      }
      setSelected(true);
      // if (treeRef.current) treeRef.current.scrollIntoView();
    },
    [dispatch, open]
  );

  useEffect(() => {
    if (selected) {
      regenKeyListeners();
    }
  }, [selected, regenKeyListeners]);

  useEffect(() => {
    setIsOpen(treeCurrentId == id && treeCurrentType == type);
  }, [treeCurrentType, treeCurrentId]);

  let padding = "0px";
  if (type == "chapter") padding = "18px";
  if (type == "step") padding = "30px";

  return (
    <>
      <div
        ref={treeRef}
        id={id}
        draggable
        onDrag={(e) => onDrag(e, type, id, parentId)}
        onDrop={(e) => onDrop(e, type, id, parentId)}
        onDragOver={(e) => onDragOver(e, uniqueId)}
        className={`tree-folder ${selected ? "selected" : ""} ${
          isOpen ? "open" : ""
        } ${dragOver == uniqueId ? "drag-target" : ""}`}
        onClick={doOpen}
        tabIndex={tabIndex}
        style={{ paddingLeft: padding }}
      >
        <div className={`folder-drop ${open ? "open" : ""}`}>
          <IconTreeTop
            style={{ margin: "auto" }}
            fill={`var(--color-${isOpen ? "text" : "magenda"})`}
          />
        </div>
        <div
          className={`folder-name ${
            state == STATE_LOADING ? "tree-loading" : ""
          }`}
        >
          {dataName || name}
        </div>
      </div>
      <div
        className="tree-folder-container"
        style={{ height: open ? "auto" : "0px" }}
      >
        {children.map((ch, idx) => {
          return type == "lesson" || type == "chapter" ? (
            <TreeFolder
              siblings={children}
              tabIndex={idx}
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
              tabIndex={idx}
              siblings={children}
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
  tabIndex: number;
  siblings: IDName[];
}

function TreeItem(props: TreeItemProps) {
  const { id, parentId, uniqueId, name, tabIndex, siblings } = props;
  const dispatch = useDispatch();
  const {
    toggleSelects,
    treeCurrentType,
    treeCurrentId,
    treeItems,
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
        .catch(() => setState(STATE_ERR));
    }
  }, [dispatch, id, state]);

  const keyUpDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();
      let findId = "";
      if (e.key === "ArrowDown") {
        const nextIdx = tabIndex + 1;
        if (nextIdx > siblings.length - 1) {
          // Go to next parent
          const slice = store.getState().createLessonV2;
          const grandpa = uniqueId.split(".")[1];
          const parentSiblings = slice.treeChapters[grandpa].steps;
          const pos = idNamePos(parentSiblings, parentId);
          if (pos + 1 < parentSiblings.length) {
            findId = parentSiblings[pos + 1]._id;
          } else {
            findId = id;
          }
        } else {
          // Go to next sibling
          findId = siblings[nextIdx]._id;
        }
      } else {
        const nextIdx = tabIndex - 1;
        if (nextIdx < 0) {
          // Go to parent
          findId = parentId;
        } else {
          // Go to previous sibling
          findId = siblings[nextIdx]._id;
        }
      }

      if (findId !== "") {
        const div = document.getElementById(findId);
        setSelected(false);
        console.log(findId);
        if (div) div.click();
      }
    },
    [tabIndex, selected, siblings]
  );

  const regenKeyListeners = useCallback(() => {
    addKeyDownListener("Delete", () => {
      onDelete("item", id, parentId);
    });
    addKeyDownListener("ArrowUp", keyUpDown);
    addKeyDownListener("ArrowDown", keyUpDown);
  }, []);

  useEffect(() => {
    if (selected) {
      regenKeyListeners();
    }
  }, [selected, regenKeyListeners]);

  const doOpen = useCallback(() => {
    if (id) {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_DATA",
        arg: {
          currentLesson: uniqueId.split(".")[0],
          currentChapter: uniqueId.split(".")[1],
          currentStep: parentId,
          currentItem: id,
        },
      });
    }
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_TREE",
      arg: { type: "item", uniqueId, id },
    });
    regenKeyListeners();
    setSelected(true);
  }, [dispatch, id, regenKeyListeners]);

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

  const Icon = getItemIcon(itemData);

  return (
    <div
      id={id}
      draggable
      onDrag={(e) => onDrag(e, "item", id, parentId)}
      onDrop={(e) => onDrop(e, "item", id, parentId)}
      onDragOver={(e) => onDragOver(e, uniqueId)}
      className={`tree-item-container ${selected ? "selected" : ""} ${
        isOpen ? "open" : ""
      } ${dragOver == uniqueId ? "drag-target" : ""}`}
      onClick={state == STATE_OK || state == STATE_IDLE ? doOpen : undefined}
      style={{ paddingLeft: "50px" }}
    >
      <div className="item-icon-tree shadow-pink">
        {Icon && <Icon style={{ margin: "auto" }} fill="var(--color-pink)" />}
      </div>
      <div
        className={`item-name ${state == STATE_LOADING ? "tree-loading" : ""}`}
      >
        {itemData?.name || itemData?.type || name}
      </div>
      <div className="item-trigger">
        {itemData && itemData.endOn.length > 0 && (
          <TriggerIcon width="14px" height="14px" fill="var(--color-pink)" />
        )}
      </div>
    </div>
  );
}

export default function LessonTree() {
  const { lessons } = useSelector((state: AppState) => state.createLessonV2);
  return (
    <Flex column>
      {lessons.map((d, idx) => (
        <TreeFolder
          siblings={lessons}
          tabIndex={idx}
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
