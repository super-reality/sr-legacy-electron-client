import React, { useCallback, useState } from "react";
import { TypeValue } from "../../../../types/utils";
import ButtonCheckbox from "../button-checkbox";
import useBasePanel from "./useBasePanel";
import { ImageFoundList, ImageFoundView } from "./views/imageFound";
import { RecordingsList, RecordingsView } from "./views/recordings";

interface TypeIdSelectorPanelProps {
  title: string;
  single: boolean;
  types: string[];
  baseData: TypeValue[];
  callback: (val: TypeValue[]) => void;
}

export default function TypeIdSelectorPanel(props: TypeIdSelectorPanelProps) {
  const { title, single, types, baseData, callback } = props;

  const [dataType, setDataType] = useState<string | null>(null);
  const [dataId, setDataId] = useState<string | null>(null);

  const [data, setData] = useState(baseData);

  const doCallback = useCallback(
    (type: string, value: any | null) => {
      let newData = data;
      if (single) {
        newData = [
          {
            type,
            value,
          },
        ];
      } else {
        // here it will fail for multi selection deselection
        newData = data.map((d) => {
          if (type == d.type) return { ...d, value };
          return d;
        });
      }

      const filtered = newData.filter((d) => d.value !== null);

      setData(filtered);
      callback(filtered);
    },
    [data, single, callback]
  );

  const doUnCheck = useCallback(
    (type: string) => {
      doCallback(type, null);
    },
    [doCallback]
  );

  const active: string[] = [];

  const currentValue = data.filter((d) => d.type == dataType)[0]?.value || null;

  const Panel = useBasePanel(title);

  let ListView: ((props: any) => JSX.Element) | null = null;
  let SingleView: ((props: any) => JSX.Element) | null = null;

  switch (dataType) {
    // Canvas
    case "Recording":
      ListView = RecordingsList;
      SingleView = RecordingsView;
      break;
    // Start Step
    case "Image Found":
      ListView = ImageFoundList;
      SingleView = ImageFoundView;
      break;
    default:
      break;
  }

  return (
    <Panel>
      <div className="panel">
        <div className="panel-subtitle">Active</div>
        {data.map((t) => {
          active.push(t.type);
          return (
            <ButtonCheckbox
              key={`panel-button-active-${t.type}`}
              text={t.type}
              check
              onButtonClick={() => setDataType(t.type)}
              onCheckClick={(e) => {
                e.stopPropagation();
                doUnCheck(t.type);
              }}
            />
          );
        })}
        <div className="panel-subtitle">Library</div>
        {types.map((t) => {
          if (active.includes(t)) return undefined;
          return (
            <ButtonCheckbox
              margin="8px auto"
              key={`panel-button-${t}`}
              width="145px"
              height="28px"
              text={t}
              check={false}
              onButtonClick={() => setDataType(t)}
            />
          );
        })}
      </div>
      {dataType && ListView && (
        <div className="panel">
          <ListView value={currentValue} open={setDataId} select={doCallback} />
        </div>
      )}
      {dataType && dataId && SingleView && (
        <div className="panel">
          <SingleView
            id={dataId}
            value={currentValue}
            open={setDataId}
            select={doCallback}
          />
        </div>
      )}
    </Panel>
  );
}
