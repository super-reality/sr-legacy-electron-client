import { IAbsolutePos } from "../../../items/item";

export default function updatePosMarker(
  pos: IAbsolutePos,
  anchor: boolean
): void {
  const hor = document.getElementById("horizontal-pos") as
    | HTMLDivElement
    | undefined;
  const ver = document.getElementById("vertical-pos") as
    | HTMLDivElement
    | undefined;
  const xy = document.getElementById("xy-pos") as HTMLDivElement | undefined;
  const xyText = document.getElementById("xy-pos-text") as
    | HTMLDivElement
    | undefined;

  if (hor && ver && xy && xyText) {
    hor.style.display = "block";
    ver.style.display = "block";
    xy.style.display = "flex";
    hor.style.top = `${Math.round(pos.y + pos.height / 2)}px`;
    ver.style.left = `${Math.round(pos.x + pos.width / 2)}px`;

    xy.style.left = `${Math.round(pos.x + 2)}px`;
    xy.style.top = `${Math.round(pos.y - 29)}px`;
    if (anchor) {
      xyText.innerText = `${Math.round(pos.x)}px x ${Math.round(
        pos.y
      )}px / ${Math.round(pos.width)}x${Math.round(pos.height || 0)}px`;
    } else {
      xyText.innerText = `${Math.round(pos.horizontal || 0)}% x ${Math.round(
        pos.vertical || 0
      )}% / ${Math.round(pos.width)}x${Math.round(pos.height || 0)}px`;
    }
  }
}
