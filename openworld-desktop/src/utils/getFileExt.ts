export default function getFileExt(path: string): string {
  return `.${path.split(".").pop() || ""}`;
}
