import React, { useCallback, useState } from "react";
import { TypeValue } from "../../../../types/utils";
import ButtonSimple from "../../button-simple";
import { RecordingsList, RecordingsView } from "./views/recordings";

interface TypeIdSelectorPanelProps {
  title: string;
  single: boolean;
  types: string[];
  baseData: TypeValue[];
  callback: (val: any) => void;
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

  return (
    <div className="selector-panel-container">
      <div className="panel-title">{title}</div>
      <div className="panels-flex">
        <div className="panel">
          <div className="panel-subtitle">Active</div>
          {data.map((t) => {
            active.push(t.type);
            return (
              <ButtonSimple
                key={`panel-button-${t.type}`}
                width="145px"
                height="28px"
                style={{ justifyContent: "space-between" }}
                onClick={() => setDataType(t.type)}
              >
                <div>{t.type}</div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    doUnCheck(t.type);
                  }}
                  className="button-checked"
                />
              </ButtonSimple>
            );
          })}
          <div className="panel-subtitle">Library</div>
          {types.map((t) => {
            if (active.includes(t)) return undefined;
            return (
              <ButtonSimple
                margin="8px auto"
                key={`panel-button-${t}`}
                width="145px"
                height="28px"
                style={{ justifyContent: "space-between" }}
                onClick={() => setDataType(t)}
              >
                <div>{t}</div>
                <div />
              </ButtonSimple>
            );
          })}
        </div>
        {dataType && (
          <div className="panel">
            {dataType == "Recording" && (
              <RecordingsList
                value={currentValue}
                open={setDataId}
                select={doCallback}
              />
            )}
          </div>
        )}
        {dataType && dataId && (
          <div className="panel">
            {dataType == "Recording" && (
              <RecordingsView
                id={dataId}
                value={currentValue}
                open={setDataId}
                select={doCallback}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
