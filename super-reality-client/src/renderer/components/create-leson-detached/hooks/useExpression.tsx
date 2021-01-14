import { IAnchor } from "../../../api/types/anchor/anchor";

/**
 * Preset expressions
 * @note oz 21/01/14 - This doesn't actually use a store yet,
 * but it will eventually which is why it's located here for now
 */
// @todo Replace these link with Super Reality ones
const expressions: IAnchor[] = [
  // Happy
  {
    templates: [
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/smiling-face-with-open-mouth-and-smiling-eyes_1f604.png",
    ],
    anchorFunction: "or",
    cvMatchValue: 900,
    cvCanvas: 190,
    cvDelay: 50,
    cvGrayscale: true,
    cvApplyThreshold: false,
    cvThreshold: 224,
    _id: "expression-happy",
    name: "Expression: Happy",
    type: "crop",
  },
  // Surprised
  {
    templates: [
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/face-with-open-mouth_1f62e.png",
    ],
    anchorFunction: "or",
    cvMatchValue: 900,
    cvCanvas: 190,
    cvDelay: 50,
    cvGrayscale: true,
    cvApplyThreshold: false,
    cvThreshold: 224,
    _id: "expression-surprised",
    name: "Expression: Surprised",
    type: "crop",
  },
  // Angry
  {
    templates: [
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/angry-face_1f620.png",
    ],
    anchorFunction: "or",
    cvMatchValue: 900,
    cvCanvas: 190,
    cvDelay: 50,
    cvGrayscale: true,
    cvApplyThreshold: false,
    cvThreshold: 224,
    _id: "expression-angry",
    name: "Expression: Angry",
    type: "crop",
  },
  // Kissing face
  {
    templates: [
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/kissing-face_1f617.png",
    ],
    anchorFunction: "or",
    cvMatchValue: 900,
    cvCanvas: 190,
    cvDelay: 50,
    cvGrayscale: true,
    cvApplyThreshold: false,
    cvThreshold: 224,
    _id: "expression-kissy",
    name: "Expression: Kissy",
    type: "crop",
  },
  // Eyebrow Raised
  {
    templates: [
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/face-with-one-eyebrow-raised_1f928.png",
    ],
    anchorFunction: "or",
    cvMatchValue: 900,
    cvCanvas: 190,
    cvDelay: 50,
    cvGrayscale: true,
    cvApplyThreshold: false,
    cvThreshold: 224,
    _id: "expression-eyebrowse",
    name: "Expression: Eyebrow Raised",
    type: "crop",
  },
  // Smirking
  {
    templates: [
      "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/microsoft/209/smirking-face_1f60f.png",
    ],
    anchorFunction: "or",
    cvMatchValue: 900,
    cvCanvas: 190,
    cvDelay: 50,
    cvGrayscale: true,
    cvApplyThreshold: false,
    cvThreshold: 224,
    _id: "expression-smirking",
    name: "Expression: Smirking",
    type: "crop",
  },
];

export default expressions;
