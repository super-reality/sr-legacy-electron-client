import React, { useCallback, useMemo } from "react";
import { IAnchor } from "../../../api/types/anchor/anchor";
import BaseSlider from "../../base-slider";
import BaseToggle from "../../base-toggle";

interface AnchorEditSlidersProps {
  update: (data: Partial<IAnchor>) => void;
  anchor: IAnchor;
}

export default function AnchorEditSliders(
  props: AnchorEditSlidersProps
): JSX.Element {
  const { anchor, update } = props;
  const anchorState = useMemo(() => anchor, [anchor]);

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
        title={`Match Value: ${anchorState.cvMatchValue}`}
        domain={[800, 1000]}
        defaultValues={[anchorState.cvMatchValue]}
        ticksNumber={10}
        callback={setMatchValue}
        slideCallback={setMatchValue}
      />
      <BaseSlider
        title={`Canvas Size: ${anchorState.cvCanvas}% (${Math.round(
          (window.screen.width / 100) * anchorState.cvCanvas
        )}px)`}
        domain={[10, 200]}
        defaultValues={[anchorState.cvCanvas]}
        ticksNumber={8}
        step={10}
        callback={setCanvasSize}
        slideCallback={setCanvasSize}
      />
      <BaseToggle
        title="Grayscale"
        value={anchorState.cvGrayscale}
        callback={setGrayscale}
      />
      <BaseToggle
        title="Apply Threshold"
        value={anchorState.cvApplyThreshold}
        callback={setApplyThreshold}
      />
      <BaseSlider
        title={`Threshold: ${anchorState.cvThreshold}`}
        domain={[0, 255]}
        defaultValues={[anchorState.cvThreshold]}
        ticksNumber={10}
        callback={setThreshold}
        slideCallback={setThreshold}
      />
      <BaseSlider
        title={`Delay: ${anchorState.cvDelay}ms`}
        domain={[50, 500]}
        step={10}
        defaultValues={[anchorState.cvDelay]}
        ticksNumber={10}
        callback={setDelay}
        slideCallback={setDelay}
      />
    </>
  );
}
