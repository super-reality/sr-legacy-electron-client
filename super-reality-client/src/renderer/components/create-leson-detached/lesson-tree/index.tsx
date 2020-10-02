import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import globalData from "../../../globalData";
import store, { AppState } from "../../../redux/stores/renderer";
import { ReactComponent as IconTreeTop } from "../../../../assets/svg/tree-drop.svg";
import "./index.scss";
import reduxAction from "../../../redux/reduxAction";

interface TreeFolderProps {
  id: string;
  name: string;
  type: "lesson" | "chapter" | "step";
}

function TreeFolder(props: TreeFolderProps) {
  const { id, name, type } = props;
  const dispatch = useDispatch();
  const { toggleSelects, treeCurrentType, treeCurrentId } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const [open, setOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);
  const [children, setChildren] = useState<
    {
      _id: string;
      name: string;
    }[]
  >([]);

  useEffect(() => {
    const lesson = store.getState().createLessonV2;
    if (lesson.treeCurrentId !== id || lesson.treeCurrentType !== type) {
      setSelected(false);
    }
  }, [toggleSelects]);

  const doOpen = useCallback(() => {
    if (type == "lesson") {
      setChildren(
        globalData.lessonsv2[id].chapters.map((d) => {
          return { _id: d, name: d };
        })
      );
    }
    if (type == "chapter") {
      setChildren(
        globalData.chapters[id].steps.map((d) => {
          return { _id: d, name: d };
        })
      );
    }
    if (type == "step") {
      setChildren(
        globalData.steps[id].items.map((d) => {
          return { _id: d, name: d };
        })
      );
    }
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_TREE",
      arg: { type, id },
    });
    setOpen(!open);
    setSelected(true);
  }, [dispatch, open]);

  useEffect(() => {
    setIsOpen(treeCurrentId == id && treeCurrentType == type);
  }, [treeCurrentType, treeCurrentId]);

  return (
    <>
      <div
        className={`tree-folder ${selected ? "selected" : ""} ${
          isOpen ? "open" : ""
        }`}
        onClick={doOpen}
        style={{ paddingLeft: type == "step" ? "18px" : "" }}
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
          return type == "chapter" ? (
            <TreeFolder key={ch._id} id={ch._id} name={ch.name} type="step" />
          ) : (
            <TreeItem key={ch._id} id={ch._id} name={ch.name} />
          );
        })}
      </div>
    </>
  );
}

interface TreeItemProps {
  id: string;
  name: string;
}

function TreeItem(props: TreeItemProps) {
  const { id, name } = props;
  const dispatch = useDispatch();
  const { toggleSelects, treeCurrentType, treeCurrentId } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const [selected, setSelected] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const doOpen = useCallback(() => {
    reduxAction(dispatch, {
      type: "CREATE_LESSON_V2_TREE",
      arg: { type: "item", id },
    });
    setSelected(true);
  }, [dispatch]);

  useEffect(() => {
    const lesson = store.getState().createLessonV2;
    if (lesson.treeCurrentId !== id || lesson.treeCurrentType !== "item") {
      setSelected(false);
    }
  }, [toggleSelects]);

  useEffect(() => {
    setIsOpen(treeCurrentId == id && treeCurrentType == "item");
  }, [treeCurrentType, treeCurrentId]);

  return (
    <div
      className={`tree-item-container ${selected ? "selected" : ""} ${
        isOpen ? "open" : ""
      }`}
      onClick={doOpen}
      style={{ paddingLeft: "18px" }}
    >
      <div className="item-icon" />
      <div className="item-name">{name}</div>
      <div className="item-trigger" />
    </div>
  );
}

export default function LessonTree() {
  const { chapters } = useSelector((state: AppState) => state.createLessonV2);

  return (
    <div style={{ margin: "8px 0px" }}>
      {chapters.map((ch) => (
        <TreeFolder key={ch._id} id={ch._id} name={ch.name} type="chapter" />
      ))}
    </div>
  );
}
