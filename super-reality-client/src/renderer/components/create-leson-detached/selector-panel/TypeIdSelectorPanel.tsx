import React, { useCallback, useState } from "react";
import { TypeValue } from "../../../../types/utils";
import ButtonCheckbox from "../button-checkbox";
import useBasePanel from "./useBasePanel";
import { ImageFoundList, ImageFoundView } from "./views/imageFound";
import { RecordingsList, RecordingsView } from "./views/recordings";
import { RecordingsTrimList, RecordingsTrimView } from "./views/recordingsTrim";
import { TriggerMouseList, TriggerMouseView } from "./views/triggerMouse";
import YoutubeView from "./views/youtube";

interface TypeIdSelectorPanelProps {
  title: string;
  single: boolean;
  types: string[];
  baseData: TypeValue[];
  callback: (val: TypeValue[]) => void;
  showActive?: boolean;
}

export default function TypeIdSelectorPanel(props: TypeIdSelectorPanelProps) {
  const { title, single, types, baseData, callback, showActive } = props;

  const [dataType, setDataType] = useState<string | null>(null);
  const [dataId, setDataId] = useState<string | null>(null);

  const [data, setData] = useState(baseData);

  const doCallback = useCallback(
    (type: string, value: any | null) => {
      let newData = [...data];
      if (single) {
        newData = [
          {
            type,
            value,
          },
        ];
      } else {
        // here it will fail for multi selection deselection
        let found = -1;
        data.forEach((d, i) => {
          if (type == d.type) found = i;
        });
        if (found > -1) {
          newData.splice(found, 1);
        } else {
          newData.push({
            type,
            value,
          });
        }
      }

      const filtered = newData.filter((d) => d.value !== null);

      setData(filtered);
      callback(filtered);
    },
    [data, single, callback]
  );

  const Panel = useBasePanel(title);

  let ListView: ((props: any) => JSX.Element) | null = null;
  let SingleView: ((props: any) => JSX.Element) | null = null;

  const dataIds: Record<string, string[]> = {
    Mouse: ["mouse-left", "mouse-double", "mouse-hover"],
  };

  const idsToDataType: Record<string, string> = {};
  Object.keys(dataIds).forEach((k) =>
    dataIds[k].forEach((id) => {
      idsToDataType[id] = k;
    })
  );

  switch (dataType) {
    // End step on
    case "Mouse":
      ListView = TriggerMouseList;
      SingleView = TriggerMouseView;
      break;
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
    // Video Item Source
    case "Crop":
      ListView = RecordingsTrimList;
      SingleView = RecordingsTrimView;
      break;
    // case "File":
    case "YouTube":
      ListView = YoutubeView;
      break;
    default:
      break;
  }

  const actives: string[] = [];
  data
    .map((t) => idsToDataType[t.type] || t.type)
    .forEach((t) => {
      if (!actives.includes(t)) {
        actives.push(t);
      }
    });

  return (
    <Panel>
      <div className="panel">
        {showActive ? (
          <>
            <div className="panel-subtitle">Active</div>
            {actives.map((t) => {
              return (
                <ButtonCheckbox
                  key={`panel-button-active-${t}`}
                  text={t}
                  check
                  onButtonClick={() => {
                    setDataType(t);
                    setDataId(null);
                  }}
                  onCheckClick={(e) => {
                    e.stopPropagation();
                    if (dataIds[t]) {
                      const filtered = data.filter(
                        (d) => !dataIds[t].includes(d.type)
                      );
                      setData(filtered);
                      callback(filtered);
                    } else doCallback(t, null);
                  }}
                />
              );
            })}
            <div className="panel-subtitle">Library</div>
            {types.map((t) => {
              if (actives.includes(t)) return undefined;
              return (
                <ButtonCheckbox
                  margin="8px auto"
                  key={`panel-button-${t}`}
                  width="145px"
                  height="24px"
                  text={t}
                  check={false}
                  onButtonClick={() => {
                    setDataType(t);
                    setDataId(null);
                  }}
                />
              );
            })}
          </>
        ) : (
          types.map((t) => {
            return (
              <ButtonCheckbox
                margin="8px auto"
                key={`panel-button-${t}`}
                width="145px"
                height="24px"
                text={t}
                check={false}
                onButtonClick={() => {
                  setDataType(t);
                  setDataId(null);
                }}
              />
            );
          })
        )}
      </div>
      {dataType && ListView && (
        <div className="panel">
          <ListView data={data} open={setDataId} select={doCallback} />
        </div>
      )}
      {dataType && dataId && SingleView && (
        <div className="panel">
          <SingleView
            key={`single-view-${dataId}`}
            id={dataId}
            data={data}
            open={setDataId}
            select={doCallback}
          />
        </div>
      )}
    </Panel>
  );
}
