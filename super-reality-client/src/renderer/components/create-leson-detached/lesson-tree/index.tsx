import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import globalData from "../../../globalData";
import { AppState } from "../../../redux/stores/renderer";
import "./index.scss";

interface TreeFolderProps {
  id: string;
  name: string;
  type: "chapter" | "lesson";
}

function TreeFolder(props: TreeFolderProps) {
  const { id, name, type } = props;

  const [open, setOpen] = useState<boolean>(false);
  const [children, setChildren] = useState<
    {
      _id: string;
      name: string;
    }[]
  >([]);

  const doOpen = useCallback(() => {
    setChildren(
      type == "chapter"
        ? globalData.chapters[id].steps.map((d) => {
            return { _id: d, name: d };
          })
        : globalData.steps[id].items.map((d) => {
            return { _id: d, name: d };
          })
    );
    setOpen(true);
  }, []);

  const doClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <div className="tree-folder" onClick={open ? doClose : doOpen}>
        <div className={`folder-drop ${open ? "open" : ""}`} />
        <div className="folder-name">{name}</div>
      </div>
      <div
        className="tree-folder-container"
        style={{ height: open ? "auto" : "0px" }}
      >
        {children.map((ch) => {
          return type == "chapter" ? (
            <TreeFolder key={ch._id} id={ch._id} name={ch.name} type="lesson" />
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

  return (
    <div className="tree-item-container">
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
