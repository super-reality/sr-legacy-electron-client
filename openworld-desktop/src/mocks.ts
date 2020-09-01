import { IStep } from "./types/api";
import { ICollection } from "./renderer/api/types/collection/collection";
import { ILesson, EntryOptions } from "./renderer/api/types/lesson/lesson";

export const mockCollections: ICollection[] = [
  {
    icon:
      "https://img2.freepng.es/20180828/oha/kisspng-unity-3d-computer-graphics-video-games-augmented-r-5b8597ae517de9.3224610015354817743338.jpg",
    name: "Unity",
    shortDescription:
      "World's Leading Real-Time 2D And 3D Development Platform.",
    description: "World's Leading Real-Time 2D And 3D Development Platform.",
    medias: ["https://blog.dataart.com/wp-content/uploads/2013/12/21.png"],
    tags: [],
    visibility: [],
    entry: EntryOptions.Open,
    subjects: 20,
  },
  {
    icon:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Blender_logo_no_text.svg/294px-Blender_logo_no_text.svg.png",
    name: "Blender",
    shortDescription:
      "World's Leading Real-Time 2D And 3D Development Platform.",
    description: "World's Leading Real-Time 2D And 3D Development Platform.",
    medias: [
      "https://www.blender.org/wp-content/uploads/2019/07/blender_render-1280x720.jpg?x59680",
    ],
    tags: [],
    visibility: [],
    entry: EntryOptions.Open,
    subjects: 10,
  },
];

export const mockStep: IStep = {
  id: "12",
  name: "Awesomeness",
  creator: "Jhonny C.",
  rating: 99,
  media: [],
  avatarUrl:
    "https://image.shutterstock.com/image-vector/cartoon-game-sword-vector-illustration-260nw-431439559.jpg",
  checkState: false,
  description: "Add some awesome things",
};

export const mockLessonData = {
  parent: [{ _id: "5f455a7ea5a75872b42d73da", type: "subject" }],
  medias: [
    "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1598904390808.png",
  ],
  steps: [
    {
      images: [
        "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1598904389121.png",
      ],
      functions: [],
      name: "Installation",
      description:
        "First, install VS Code.\nGo to code.visualstudio.com and download latest version for your OS.",
      trigger: 1,
      next: 1,
    },
    {
      images: [
        "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1598904389143.png",
      ],
      functions: [1],
      name: "Open",
      description:
        "Once installed, go to your desktop and double click on the VS code icon.",
      trigger: 0,
      next: 2,
    },
  ],
  tags: [],
  visibility: [],
  ownership: [],
  options: [],
  _id: "5f4d58471f990c3396043511",
  createdAt: "2020-08-31T20:06:31.418Z",
  icon:
    "https://s3.us-west-1.amazonaws.com/openverse-lms/lesson-1598904388887.png",
  name: "Open VS Code",
  shortDescription: "How to open VS code",
  description: "A small tutorial on how to open VS Code, from scratch",
  difficulty: 3,
  entry: 1,
  rating: 0,
  ratingCount: 0,
  numberOfShares: 0,
  numberOfActivations: 0,
  numberOfCompletions: 0,
  createdBy: "5f45a91aa5a75872b42d73e7",
  __v: 1,
};
