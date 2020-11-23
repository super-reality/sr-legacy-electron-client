import interact from "interactjs";

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

export const restrictSnapGrid = interact.modifiers.snap({
  targets: [interact.createSnapGrid({ x: 16, y: 16 })],
  range: Infinity,
  relativePoints: [{ x: 0, y: 0 }],
});

export const voidFunction = () => {};
