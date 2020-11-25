import interact from "interactjs";
import { EffectDB } from "../types/utils";

// eslint-disable-next-line import/prefer-default-export
export const API_URL = "http://54.183.151.100:3000/api/v1/";
export const timeout = 10000;

export const cursorChecker: any = (
  action: any,
  _interactable: any,
  _element: any,
  interacting: boolean
): string => {
  switch (action.axis) {
    case "x":
      return "ew-resize";
    case "y":
      return "ns-resize";
    default:
      return interacting ? "grabbing" : "grab";
  }
};

export const restrictMinSize =
  interact.modifiers &&
  interact.modifiers.restrictSize({
    min: { width: 10, height: 10 },
  });

export const restrictSnapRound = interact.modifiers.snap({
  targets: [interact.createSnapGrid({ x: 1, y: 1 })],
  range: Infinity,
  relativePoints: [{ x: 0, y: 0 }],
});

export const voidFunction = () => {};

const fxDirectory = `${process.env.PUBLIC_URL}/fx`;

export const effectDB: Record<string, EffectDB> = {
  id_1: {
    id: "id_1",
    name: "Rainbow Wavy Circle",
    url: `${fxDirectory}/rainbow-circle-wavy-big/index.html`,
    tags: ["pop", "rainbow"],
  },
  id_2: {
    id: "id_2",
    name: "Rainbow Confetti",
    url: `${fxDirectory}/rainbow-confetti/index.html`,
    tags: ["pop", "rainbow"],
  },
  id_3: {
    id: "id_3",
    name: "Rainbow ORB Big",
    url: `${fxDirectory}/rainbow-orb-big/index.html`,
    tags: ["pop", "rainbow"],
  },
  id_4: {
    id: "id_4",
    name: "Hyperspace1",
    url: `${fxDirectory}/hyperspace1/index.html`,
    tags: ["ambient"],
  },
  id_5: {
    id: "id_5",
    name: "Hyperspace2",
    url: `${fxDirectory}/hyperspace2/index.html`,
    tags: ["ambient"],
  },
  id_6: {
    id: "id_6",
    name: "Hyperspace3",
    url: `${fxDirectory}/hyperspace3/index.html`,
    tags: ["ambient"],
  },
};
