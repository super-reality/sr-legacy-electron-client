import { TypeValue } from "../../../../types/utils";

export interface BasePanelViewProps<T extends TypeValue | TypeValue> {
  open: (id: string) => void;
  select: (type: T["type"], value: T["value"] | null) => void;
  data: Array<T>;
}
