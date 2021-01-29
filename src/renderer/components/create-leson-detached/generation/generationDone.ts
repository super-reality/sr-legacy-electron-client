import clearTempFolder from "../lesson-utils/clearTempFolder";
import setStatus from "../lesson-utils/setStatus";

export default function generationDone(): void {
  setStatus(`Done`);
  clearTempFolder();
}
