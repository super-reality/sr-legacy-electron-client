import { IStep } from "./types/api";
import { ICollectionSearch } from "./renderer/api/types/collection/search";

export const mockCollections: ICollectionSearch[] = [
  {
    icon:
      "https://img2.freepng.es/20180828/oha/kisspng-unity-3d-computer-graphics-video-games-augmented-r-5b8597ae517de9.3224610015354817743338.jpg",
    name: "Unity",
    shortDescription:
      "World's Leading Real-Time 2D And 3D Development Platform.",
    description: "World's Leading Real-Time 2D And 3D Development Platform.",
    medias: ["https://blog.dataart.com/wp-content/uploads/2013/12/21.png"],
    _id: "as1d32a1sd3a",
    createdAt: "",
    rating: 20,
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
    _id: "as21da3sda",
    createdAt: "",
    rating: 10,
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
