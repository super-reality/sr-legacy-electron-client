import fs from "fs";
import path from "path";
import { fxPath } from "../../renderer/electron-constants";
import { EffectData } from "../../types/effects";
import getPublicPath from "../electron/getPublicPath";
import isElectron from "../electron/isElectron";
import createDataDirs from "./createDataDirs";

export function getEffectData(
  dir: string,
  name: string
): EffectData | undefined {
  let obj: EffectData | undefined;
  try {
    const data = fs.readFileSync(path.join(dir, name, "data.json"), "utf8");
    try {
      obj = JSON.parse(data);
      if (obj) {
        obj.id = name;
        obj.url = path.join(dir, name, "index.html");
      }
    } catch (e) {
      console.log(`Could not parse "${name}" fx data`);
    }
  } catch (e) {
    console.log(`Could not read "${name}" fx data`);
  }
  return obj;
}

export default function getEffectsMetadata(): EffectData[] {
  if (!isElectron()) return [];
  createDataDirs();
  const db: EffectData[] = [];
  const internalFxPath = path.join(getPublicPath(), "fx");
  // Built in effects
  fs.readdirSync(internalFxPath, { withFileTypes: true })
    .filter((f) => f.isDirectory())
    .forEach((d) => {
      const data = getEffectData(internalFxPath, d.name);
      if (data) {
        db.push(data);
      }
    });

  // Custom effects
  fs.readdirSync(fxPath, { withFileTypes: true })
    .filter((f) => f.isDirectory())
    .forEach((d) => {
      const data = getEffectData(fxPath, d.name);
      if (data) {
        db.push(data);
      }
    });
  return db;
}
