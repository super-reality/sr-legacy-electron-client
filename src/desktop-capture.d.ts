declare module "desktop-capture" {
  export function init(showCursor: boolean): void;
  export function start(): void;
  export function getFrame(): Uint8Array;
  export function close(): void;
}
