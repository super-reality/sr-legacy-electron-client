import { useMemo } from "react";
import { useSelector } from "react-redux";
import { IAnchor } from "../../../api/types/anchor/anchor";
import { AppState } from "../../../redux/stores/renderer";

export default function useAnchor(
  anchorId: string | undefined
): IAnchor | null {
  const { treeAnchors } = useSelector(
    (state: AppState) => state.createLessonV2
  );

  const anchor = useMemo(() => {
    return treeAnchors[anchorId || ""] || null;
  }, [treeAnchors, anchorId]);

  return anchor;
}
