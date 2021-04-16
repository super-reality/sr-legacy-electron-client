import { MutableRefObject, useEffect, useRef } from "react";

/**
 * Use a combined references object in a component. Useful when we use a forwardRef
 * component and want to use the reference inside it as well;
 * https://itnext.io/reusing-the-ref-from-forwardref-with-react-hooks-4ce9df693dd
 * @param refs Array of references (mutable/ref).
 */
export default function useCombinedRefs<T>(
  ...refs: (
    | ((instance: T | null) => void)
    | MutableRefObject<T | null>
    | null
  )[]
): MutableRefObject<T | null> {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref || targetRef?.current == undefined) return;

      if (typeof ref === "function") {
        ref(targetRef.current);
      } else {
        // eslint-disable-next-line no-param-reassign
        ref.current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
}
