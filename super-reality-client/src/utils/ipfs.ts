import * as IPFS from "ipfs";
import { IPFSEntry } from "ipfs-core-types/src/files";
import { forEach } from "./asyncTools";

let ipfsInstance: IPFS.IPFS;

export async function initIPFS() {
  ipfsInstance = await IPFS.create();
  const version = await ipfsInstance.version();
  console.log("IPFS Version:", version.version);
}

export async function cleanupIPFS() {
  await ipfsInstance?.stop();
}

function concatUint8Arrays(A: Uint8Array, B: Uint8Array): Uint8Array {
  const c = new Uint8Array(A.length + B.length);
  c.set(A, 0);
  c.set(B, A.length);
  return c;
}

export async function resolveResourceIPFS(cid: string) {
  const files: Uint8Array[] = [];
  forEach(ipfsInstance.get(cid), (file: IPFSEntry) => {
    if (file.type == "dir" || !file.content) return;
    let content = new Uint8Array();

    forEach(file.content, (chunk: Uint8Array) => {
      content = concatUint8Arrays(content, chunk);
    });

    files.push(content);
  });
  return files;
}

export async function saveResourceIPFS(data: Uint8Array, pin = true) {
  const { cid } = await ipfsInstance.add(data);
  if (pin) {
    return (await ipfsInstance.pin.add(cid)).toString();
  }
  return cid.toString();
}
