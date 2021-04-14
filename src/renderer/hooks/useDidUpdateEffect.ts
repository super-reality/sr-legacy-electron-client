import { useEffect, useRef } from "react";

export default function useDidUpdateEffect(fn: () => any, inputs: any[]) {
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
}
