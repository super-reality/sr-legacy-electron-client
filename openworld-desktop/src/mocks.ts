import { ILessonData, IStep } from "./types/api";
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

export const mockLessonData: ILessonData = {
  id: "35",
  name: "Box Modelling",
  creator: "Jhonny C.",
  purpose: "",
  media: [],
  avatarUrl:
    "https://sites.google.com/site/lukepickerings3dwork/_/rsrc/1392205456929/home/mesh-construction/box-modelling/Box%20Modelling.jpg",
  rating: 4.9,
  checkState: false,
  subjectName: "Blender",
  steps: [
    {
      id: "12",
      name: "Awesomeness",
      creator: "Jhonny C.",
      rating: 99,
      media: [],
      avatarUrl:
        "https://image.shutterstock.com/image-vector/cartoon-game-sword-vector-illustration-260nw-431439559.jpg",
      checkState: false,
      description: "Learn how to make awesomeness",
    },
    {
      id: "01",
      name: "Juice",
      creator: "Jhonny C.",
      rating: 45,
      media: [],
      avatarUrl:
        "https://lexiscleankitchen.com/wp-content/uploads/2018/12/Kick-That-Cold-Juice1.jpg",
      checkState: false,
      description: "Add some juicy juice!",
    },
    {
      id: "78",
      name: "Draw bolts",
      creator: "Jhonny C.",
      rating: 42,
      media: [],
      avatarUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ-7E002_QIzTSzYBIXoArw4qKChtf2vEIStg&usqp=CAU",
      checkState: false,
      description: "Make stuff blow up",
    },
    {
      id: "56",
      name: "Hit something",
      creator: "Jhonny C.",
      rating: 37,
      media: [],
      avatarUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDADslFYupS-oEjgKOxTMxQPNDG6F8pTHTReZ_5XPcUYa3ezpJ&s",
      checkState: false,
      description: "Make your character punch some stuff",
    },
  ],
};
