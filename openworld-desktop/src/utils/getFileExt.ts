export default function getFileExt(path: string): string {
  const pop = path.split(".").pop();
  if (pop == path) return "";
  return `.${pop || ""}`;
}
