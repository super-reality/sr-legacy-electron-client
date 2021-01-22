import { EffectMessage } from "../types/effects";

export default function sendEffectMessage(
  iframe: HTMLIFrameElement,
  message: EffectMessage
): void {
  if (iframe.contentWindow) {
    iframe.contentWindow.postMessage(message, "*");
  }
}
