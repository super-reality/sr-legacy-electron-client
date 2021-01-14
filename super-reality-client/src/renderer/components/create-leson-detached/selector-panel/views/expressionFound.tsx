import React, { useCallback, useState } from "react";
import "./imageFound.scss";
import { BasePanelViewProps } from "../viewTypes";
import ContainerWithCheck from "../../../container-with-check";
import AnchorEdit from "../../anchor-edit";
import { IAnchor } from "../../../../api/types/anchor/anchor";
import ImageCheckbox from "../../image-checkbox";
import AnchorCommands from "../../../anchor-commands";
import useAnchor from "../../hooks/useAnchor";
import expressions from "../../hooks/useExpression";

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

  // Filters
  const filterFn = (a: IAnchor) =>
    data.filter((d) => d.type == "Expression Found" && d.value == a._id)[0];
  const filterFnCheck = (a: IAnchor) => !!filterFn(a);
  const filterFnUnCheck = (a: IAnchor) => !filterFn(a);

  return (
    <>
      <div className="panel-subtitle">Active</div>
      {expressions.filter(filterFnCheck).map((a) => (
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
      {expressions.filter(filterFnUnCheck).map((a) => (
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

/**
 * Expression Found customization panel
 */
export function ExpressionFoundView(
  props: BasePanelViewProps<ExpressionFoundTypeValue> & {
    id: string;
  }
) {
  const [currentTemplate, setCurrentTemplate] = useState(0);
  const { id, data, select } = props;

  const anchor = useAnchor(id);

  console.log(anchor);

  const doCheckToggle = useCallback(
    (val: boolean) => select("Expression Found", val ? id : null),
    [id, select]
  );

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
      </div>
      <AnchorEdit key={`anchor-edit-${id}`} anchorId={id} />
    </>
  );
}
