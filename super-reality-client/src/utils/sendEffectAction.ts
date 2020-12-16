import { EffectAction } from "../types/effects";

export default function sendEffectAction(
  iframe: HTMLIFrameElement,
  action: EffectAction
): void {
  if (iframe.contentWindow) {
    iframe.contentWindow.postMessage(action, "*");
  }
}
