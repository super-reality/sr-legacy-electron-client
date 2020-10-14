import React from "react";
import { ReactComponent as IconSelected } from "../../../../assets/svg/modal-list-selected.svg";
import { ReactComponent as Icon } from "../../../../assets/svg/modal-list.svg";

interface ModalItemProps {
  selected: boolean;
  name: string;
  id: string;
  callback: (id: string) => void;
}

function ModalItem(props: ModalItemProps): JSX.Element {
  const { selected, name, id, callback } = props;

  const style = { width: "14px", height: "14px", margin: "auto" };

  return (
    <div className="tree-item-container">
      <div
        className="item-icon-tree"
        onClick={() => callback(selected ? "" : id)}
      >
        {selected ? <IconSelected style={style} /> : <Icon style={style} />}
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
  setCurrent: (id: string) => void;
}

export default function ModalList<T extends baseOption>(
  props: ModalListProps<T>
): JSX.Element {
  const { options, current, setCurrent } = props;

  return (
    <>
      {options.map((obj) => {
        return (
          <ModalItem
            callback={setCurrent}
            name={obj.name}
            id={obj._id}
            selected={current == obj._id}
            key={`modal-item-${obj._id}`}
          />
        );
      })}
    </>
  );
}
