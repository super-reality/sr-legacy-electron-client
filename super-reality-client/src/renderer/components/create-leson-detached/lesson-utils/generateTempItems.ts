import getImage from "../../../../utils/getImage";
import sha1 from "../../../../utils/md5";
import userDataPath from "../../../../utils/userDataPath";
import { Item } from "../../../api/types/item/item";
import { StepData } from "../recorder/types";

type Items = Record<string, Item>;

export default function generateTempItems(data: StepData[]): Items {
  const ret: Items = {};
  data.forEach((rawStep) => {
    const id = sha1(`${rawStep.name}`);
    // const img = getImage(`${userDataPath()}/step/snapshots/${}/${rawStep.name}`);
    ret[id] = {
      _id: id,
      name: rawStep.name,
      type: "focus_highlight",
      focus: "Mouse Point",
      relativePos: {
        x: rawStep.x_cordinate,
        y: rawStep.y_cordinate,
        width: 10, // img.width,
        height: 10, // img.height,
      },
      trigger: null,
      destination: "", // a step ID to go to
      transition: 0, // type
      anchor: true,
    };
  });

  return ret;
}
