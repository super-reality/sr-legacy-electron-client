import userDataPath from "../utils/files/userDataPath";

const userData = userDataPath();

export const stepPath = `${userData}/step/`;

export const recordingPath = `${userData}/step/media/`;

export const stepSnapshotPath = `${userData}/step/snapshots/`;

export const itemsPath = `${userData}/item/`;

export const tempPath = `${userData}/temp/`;

export const fxPath = `${userData}/fx/`;

export const ocrCachePath = `${userData}/lang-data`;
