import { IDName } from "..";

export interface IStep {
  _id: string;
  name: string;
  anchor: string | null;
  items: IDName[];
  recordingId?: string;
  recordingTimestamp?: string;
  snapshot?: string;
}
