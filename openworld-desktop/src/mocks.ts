import { IStep } from "./types/api";
import { ICollection } from "./renderer/api/types/collection/collection";
import { EntryOptions } from "./renderer/api/types/lesson/lesson";

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
