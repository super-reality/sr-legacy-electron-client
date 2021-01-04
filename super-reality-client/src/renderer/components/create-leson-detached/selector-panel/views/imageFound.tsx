import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { BasePanelViewProps } from "../viewTypes";
import ContainerWithCheck from "../../../container-with-check";
import ButtonCheckbox from "../../button-checkbox";
import { AppState } from "../../../../redux/stores/renderer";

export interface ImageFoundTypeValue {
  type: "Image Found";
  value: string;
}

export function ImageFoundList(props: BasePanelViewProps<ImageFoundTypeValue>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { select, value, open } = props;

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

  return (
    <>
      {anchors.map((a) => (
        <ButtonCheckbox
          text={a.name}
          margin="8px auto"
          key={`image-found-button-${a._id}`}
          showDisabled={false}
          check={value == a._id}
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
  const { id, value, select } = props;

  const { treeAnchors } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const anchor = useMemo(() => {
    return treeAnchors[id || ""] || null;
  }, [treeAnchors, id]);

  const doCheckToggle = useCallback(
    (val: boolean) => select("Image Found", val ? id : null),
    [id, select]
  );

  return (
    <>
      <ContainerWithCheck checked={value == id} callback={doCheckToggle}>
        <div
          style={{
            backgroundImage: `url(${anchor.templates[0]})`,
            width: "300px",
          }}
        />
      </ContainerWithCheck>
    </>
  );
}
