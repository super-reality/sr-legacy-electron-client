import { Howl } from "howler";

export default function playSound(source: string) {
  const sound = new Howl({
    src: source,
    autoplay: true,
    loop: false,
    volume: 0.5,
  });
}
