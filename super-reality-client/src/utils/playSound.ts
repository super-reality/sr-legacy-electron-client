import { Howl, Howler } from "howler";

export default function playSound(source: string): Promise<void> {
  Howler.unload();
  return new Promise((resolve, reject) => {
    const sound = new Howl({
      src: source,
      autoplay: true,
      loop: false,
      volume: 0.5,
    });
    sound.on("end", () => resolve());
    sound.on("stop", () => resolve());
    sound.on("loaderror", reject);
  });
}
