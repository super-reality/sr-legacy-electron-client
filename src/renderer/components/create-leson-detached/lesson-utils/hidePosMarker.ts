export default function hidePosMarker(): void {
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
    hor.style.display = "none";
    ver.style.display = "none";
    xy.style.display = "none";
  }
}
