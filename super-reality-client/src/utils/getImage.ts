export default function getImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "Anonymous";
    img.setAttribute("crossOrigin", "");
    img.src = `${url}?${new Date().getTime()}`;
  });
}
