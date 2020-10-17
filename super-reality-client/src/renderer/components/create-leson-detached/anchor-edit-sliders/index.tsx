import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { IAnchor } from "../../../api/types/anchor/anchor";
import { AppState } from "../../../redux/stores/renderer";
import BaseSlider from "../../base-slider";
import BaseToggle from "../../base-toggle";

interface AnchorEditSlidersProps {
  update: (data: Partial<IAnchor>) => void;
}

export default function AnchorEditSliders(
  props: AnchorEditSlidersProps
): JSX.Element {
  const { update } = props;

  const { currentAnchor, treeAnchors } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const anchor = useMemo(() => {
    return treeAnchors[currentAnchor || ""] || null;
  }, [treeAnchors, currentAnchor]);

  const setMatchValue = useCallback(
    (n: readonly number[]) => {
      update({ cvMatchValue: n[0] });
    },
    [update]
  );

  const setCanvasSize = useCallback(
    (n: readonly number[]) => {
      update({ cvCanvas: n[0] });
    },
    [update]
  );

  const setDelay = useCallback(
    (n: readonly number[]) => {
      update({ cvDelay: n[0] });
    },
    [update]
  );

  const setGrayscale = useCallback(
    (val: boolean) => {
      update({ cvGrayscale: val });
    },
    [update]
  );

  const setApplyThreshold = useCallback(
    (val: boolean) => {
      update({ cvApplyThreshold: val });
    },
    [update]
  );

  const setThreshold = useCallback(
    (n: readonly number[]) => {
      update({ cvThreshold: n[0] });
    },
    [update]
  );
  return (
    <>
      <BaseSlider
        title={`Match Value: ${anchor.cvMatchValue}`}
        domain={[800, 1000]}
        defaultValues={[anchor.cvMatchValue]}
        ticksNumber={10}
        callback={setMatchValue}
        slideCallback={setMatchValue}
      />
      <BaseSlider
        title={`Canvas Size: ${anchor.cvCanvas}% (${Math.round(
          (window.screen.width / 100) * anchor.cvCanvas
        )}px)`}
        domain={[10, 200]}
        defaultValues={[anchor.cvCanvas]}
        ticksNumber={8}
        step={10}
        callback={setCanvasSize}
        slideCallback={setCanvasSize}
      />
      <BaseToggle
        title="Grayscale"
        value={anchor.cvGrayscale}
        callback={setGrayscale}
      />
      <BaseToggle
        title="Apply Threshold"
        value={anchor.cvApplyThreshold}
        callback={setApplyThreshold}
      />
      <BaseSlider
        title={`Threshold: ${anchor.cvThreshold}`}
        domain={[0, 255]}
        defaultValues={[anchor.cvThreshold]}
        ticksNumber={10}
        callback={setThreshold}
        slideCallback={setThreshold}
      />
      <BaseSlider
        title={`Delay: ${anchor.cvDelay}ms`}
        domain={[1, 200]}
        defaultValues={[anchor.cvDelay]}
        ticksNumber={10}
        callback={setDelay}
        slideCallback={setDelay}
      />
    </>
  );
}
