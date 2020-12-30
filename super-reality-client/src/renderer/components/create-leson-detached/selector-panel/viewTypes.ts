export interface BasePanelViewProps {
  open: (id: string) => void;
  select: (type: string, value: any) => void;
}
