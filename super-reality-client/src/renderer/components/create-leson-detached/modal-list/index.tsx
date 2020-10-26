import React from "react";
import { ReactComponent as IconSelected } from "../../../../assets/svg/modal-list-selected.svg";
import { ReactComponent as Icon } from "../../../../assets/svg/modal-list.svg";

interface ModalItemProps {
  selected: boolean;
  checked: boolean;
  name: string;
  id: string;
  checkCallback: (id: string | null) => void;
  clickCallback?: (id: string | null) => void;
}

function ModalItem(props: ModalItemProps): JSX.Element {
  const { selected, checked, name, id, checkCallback, clickCallback } = props;

  const style = { width: "14px", height: "14px", margin: "auto" };

  return (
    <div
      className={`tree-item-container ${selected ? "selected" : ""}`}
      onClick={() => {
        if (clickCallback) clickCallback(id);
      }}
    >
      <div
        className="item-icon-tree"
        onClick={() => checkCallback(checked ? null : id)}
      >
        {checked ? <IconSelected style={style} /> : <Icon style={style} />}
      </div>
      <div className="item-name">{name}</div>
    </div>
  );
}

interface baseOption {
  _id: string;
  name: string;
}

interface ModalListProps<T> {
  options: T[];
  current: string;
  selected: string;
  setCurrent: (id: string | null) => void;
  open?: (id: string | null) => void;
}

export default function ModalList<T extends baseOption>(
  props: ModalListProps<T>
): JSX.Element {
  const { options, current, selected, setCurrent, open } = props;

  return (
    <>
      {options.map((obj) => {
        return (
          <ModalItem
            checkCallback={setCurrent}
            clickCallback={open}
            name={obj.name}
            id={obj._id}
            checked={current == obj._id}
            selected={selected == obj._id}
            key={`modal-item-${obj._id}`}
          />
        );
      })}
    </>
  );
}
