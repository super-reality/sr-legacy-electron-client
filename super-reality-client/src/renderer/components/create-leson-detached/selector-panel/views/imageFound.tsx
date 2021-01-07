import React, { useCallback, useMemo, useState } from "react";
import "./imageFound.scss";
import { useSelector } from "react-redux";
import { BasePanelViewProps } from "../viewTypes";
import ContainerWithCheck from "../../../container-with-check";
import { AppState } from "../../../../redux/stores/renderer";
import AnchorEdit from "../../anchor-edit";
import { IAnchor } from "../../../../api/types/anchor/anchor";
import ImageCheckbox from "../../image-checkbox";
import AnchorCommands from "../../../anchor-commands";
import useAnchor from "../../hooks/useAnchor";

export interface ImageFoundTypeValue {
  type: "Image Found";
  value: string;
}

export function ImageFoundList(props: BasePanelViewProps<ImageFoundTypeValue>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { select, data, open } = props;

  const { treeAnchors } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const anchors = useMemo(
    () => Object.keys(treeAnchors).map((a) => treeAnchors[a]),
    [treeAnchors]
  );

  const doUnCheck = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      select("Image Found", null);
    },
    [select]
  );

  const filterFn = (a: IAnchor) =>
    data.filter((d) => d.type == "Image Found" && d.value == a._id)[0];
  const filterFnCheck = (a: IAnchor) => !!filterFn(a);
  const filterFnUnCheck = (a: IAnchor) => !filterFn(a);

  return (
    <>
      <div className="panel-subtitle">Active</div>
      {anchors.filter(filterFnCheck).map((a) => (
        <ImageCheckbox
          image={a.templates[0]}
          margin="8px auto"
          key={`image-found-button-${a._id}`}
          showDisabled={false}
          check
          onButtonClick={() => open(a._id)}
          onCheckClick={doUnCheck}
        />
      ))}
      <div className="panel-subtitle">Library</div>
      {anchors.filter(filterFnUnCheck).map((a) => (
        <ImageCheckbox
          image={a.templates[0]}
          margin="8px auto"
          key={`image-found-button-${a._id}`}
          showDisabled={false}
          check={false}
          onButtonClick={() => open(a._id)}
          onCheckClick={doUnCheck}
        />
      ))}
    </>
  );
}

export function ImageFoundView(
  props: BasePanelViewProps<ImageFoundTypeValue> & {
    id: string;
  }
) {
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const { id, data, select } = props;

  const anchor = useAnchor(id);

  const doCheckToggle = useCallback(
    (val: boolean) => select("Image Found", val ? id : null),
    [id, select]
  );

  const prevTemplate = useCallback(() => {
    if (currentTemplate > 0) setCurrentTemplate(currentTemplate - 1);
    else if (anchor) setCurrentTemplate(anchor.templates.length - 1);
  }, [currentTemplate, anchor]);

  const nextTemplate = useCallback(() => {
    if (anchor && currentTemplate < anchor.templates.length)
      setCurrentTemplate(currentTemplate + 1);
    else setCurrentTemplate(0);
  }, [currentTemplate, anchor]);

  const checked = !!data.filter(
    (d) => d.type == "Image Found" && d.value == anchor?._id
  )[0];

  return (
    <>
      <ContainerWithCheck checked={checked} callback={doCheckToggle}>
        <div
          className="anchor-image-preview"
          style={{
            backgroundImage: `url(${anchor?.templates[currentTemplate]})`,
          }}
        />
        <AnchorCommands
          key={`anchor-commands-${id}`}
          template={currentTemplate}
          anchorId={id}
        />
      </ContainerWithCheck>
      <div className="anchor-templates-carousel">
        <div className="left-arrow" onClick={prevTemplate}>
          {"<"}
        </div>
        {anchor?.templates.map((t, i) => {
          return (
            <div
              key={`carousel-image-${t}`}
              style={{ backgroundImage: `url(${t})` }}
              onClick={() => setCurrentTemplate(i)}
              className={`template ${currentTemplate == i ? "selected" : ""}`}
            />
          );
        })}
        <div className="right-arrow" onClick={nextTemplate}>
          {">"}
        </div>
      </div>
      <AnchorEdit key={`anchor-edit-${id}`} anchorId={id} />
    </>
  );
}
