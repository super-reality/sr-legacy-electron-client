import {v4 as uuidv4} from "uuid";

export const SETIMAGE = "SETIMAGE";

export const setImage = (url) => ({type: SETIMAGE, payload: {path: url}});

