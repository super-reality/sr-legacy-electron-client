import React, { useCallback, useState } from "react";
import "./imageFound.scss";
import { BasePanelViewProps } from "../viewTypes";
import ContainerWithCheck from "../../../container-with-check";
import AnchorEdit from "../../anchor-edit";
import { IAnchor } from "../../../../api/types/anchor/anchor";
import ImageCheckbox from "../../image-checkbox";
import AnchorCommands from "../../../anchor-commands";
import useAnchor from "../../hooks/useAnchor";

export interface ExpressionFoundTypeValue {
  type: "Expression Found";
  value: string;
}

/**
 * Expression list in Start Step When
 */
export function ExpressionFoundList(
  props: BasePanelViewProps<ExpressionFoundTypeValue>
) {
  const { select, data, open } = props;

  const doUnCheck = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.stopPropagation();
      select("Expression Found", null);
    },
    [select]
  );

  // Anchors
  // @todo Replace these link with Super Reality ones
  const anchors: IAnchor[] = [
    {
      templates: [
        "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/smirking-face_1f60f.png",
      ],
      anchorFunction: "or",
      cvMatchValue: 900,
      cvCanvas: 190,
      cvDelay: 50,
      cvGrayscale: true,
      cvApplyThreshold: false,
      cvThreshold: 224,
      _id: "expression-smirk",
      name: "Expression: Smirk",
      type: "crop",
    },
    {
      templates: [
        "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/winking-face_1f609.png",
      ],
      anchorFunction: "or",
      cvMatchValue: 900,
      cvCanvas: 190,
      cvDelay: 50,
      cvGrayscale: true,
      cvApplyThreshold: false,
      cvThreshold: 224,
      _id: "expression-wink",
      name: "Expression: Wink",
      type: "crop",
    },
    {
      templates: [
        "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/face-with-open-mouth_1f62e.png",
      ],
      anchorFunction: "or",
      cvMatchValue: 900,
      cvCanvas: 190,
      cvDelay: 50,
      cvGrayscale: true,
      cvApplyThreshold: false,
      cvThreshold: 224,
      _id: "expression-surprised",
      name: "Expression: Surprised",
      type: "crop",
    },
  ];

  // Filters
  const filterFn = (a: IAnchor) =>
    data.filter((d) => d.type == "Expression Found" && d.value == a._id)[0];
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

export function ExpressionFoundView(
  props: BasePanelViewProps<ExpressionFoundTypeValue> & {
    id: string;
  }
) {
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const { id, data, select } = props;

  const anchor = useAnchor(id);

  const doCheckToggle = useCallback(
    (val: boolean) => select("Expression Found", val ? id : null),
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
    (d) => d.type == "Expression Found" && d.value == anchor?._id
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
        <div className="left-arrow" onClick={prevTemplate} />
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
        <div className="right-arrow" onClick={nextTemplate} />
      </div>
      <AnchorEdit key={`anchor-edit-${id}`} anchorId={id} />
    </>
  );
}
