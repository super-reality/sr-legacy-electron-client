import { useState, useCallback, useMemo } from "react";
import TrashButton from "../components/trash-button";

export default function useTrashButton(
  type: string,
  id: string | undefined
): [() => JSX.Element, boolean] {
  const [deleted, setDeleted] = useState<boolean>(false);

  const idMemo = useMemo(() => id, [id]);

  const call = useCallback(() => {
    setDeleted(true);
  }, []);

  const Component = () => (
    <TrashButton type={type} id={idMemo || ""} callback={call} />
  );
  return [Component, deleted];
}
