import React, { useCallback, useState } from "react";
import ButtonSimple from "../../button-simple";
import "./index.scss";

interface TypeValue {
  type: string;
  value: any;
}

interface TypeIdSelectorPanelProps {
  title: string;
  single: boolean;
  types: string[];
  baseData: TypeValue[];
  callback: (val: any) => void;
}

export function TypeIdSelectorPanel(props: TypeIdSelectorPanelProps) {
  const { title, single, types, baseData, callback } = props;

  const [dataType, setDataType] = useState<string | null>(null);
  const [dataId, _setDataId] = useState<string | null>(null);

  const [data, setData] = useState(baseData);

  const _doCallback = useCallback(
    (type: string, value: any) => {
      let newData = data;
      if (single) {
        newData = [
          {
            type,
            value,
          },
        ];
      } else {
        newData = data.map((d) => {
          if (type == d.type) return { ...d, value };
          return d;
        });
      }

      setData(newData);
      callback(newData);
    },
    [data, single, callback]
  );

  const active: string[] = [];

  return (
    <div className="selector-panel-container">
      <div className="panel-title">{title}</div>
      <div className="panels-flex">
        <div className="panel-a">
          <div className="panel-subtitle">Active</div>
          {data.map((t) => {
            active.push(t.type);
            return (
              <ButtonSimple
                key={`panel-button-${t.type}`}
                width="145px"
                height="30px"
                onClick={() => setDataType(t.type)}
              >
                {t.type}
              </ButtonSimple>
            );
          })}
          <div className="panel-subtitle">Library</div>
          {types.map((t) => {
            if (active.includes(t)) return undefined;
            return (
              <ButtonSimple
                key={`panel-button-${t}`}
                width="145px"
                height="30px"
                onClick={() => setDataType(t)}
              >
                {t}
              </ButtonSimple>
            );
          })}
        </div>
        {dataType && (
          <div className="panel-b">
            {
              // Draw component list based on type
              // callback={setDataId}
              // select={doCallback}
            }
          </div>
        )}
        {dataId && (
          <div className="panel-c">
            {
              // Draw component based on type/id (preview)
              // callback={setDataId}
              // select={doCallback}
            }
          </div>
        )}
      </div>
    </div>
  );
}

interface CanvasSelectorPanelProps {
  stepId: string;
}

export function CanvasSelectorPanel(props: CanvasSelectorPanelProps) {
  const { stepId } = props;

  const doUpdate = useCallback(
    (_val: any) => {
      // Should update the step with the update canvas key
    },
    [stepId]
  );

  return (
    <TypeIdSelectorPanel
      title="Step Canvas"
      single
      types={[
        "Image",
        "Recording",
        "Process",
        "Facial Expression",
        "Browser",
        "GPS",
        "Body Pose",
        "Brainwave",
        "User",
        "Object",
        "Gaze",
        "Sound",
        "Smell",
        "Taste",
        "AI",
        "Organism",
        "Language",
      ]}
      baseData={[]}
      callback={doUpdate}
    />
  );
}
