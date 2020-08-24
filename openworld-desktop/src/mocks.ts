import { ILessonData, IStep } from "./types/api";
import { ICollection } from "./renderer/api/types/collection/collection";
import { EntryOptions } from "./renderer/api/types/lesson/lesson";

export const mockCollections: ICollection[] = [
  {
    icon:
      "https://cdn-sharing.adobecc.com/id/urn:aaid:sc:US:b9bafe78-9b7b-4d12-9709-9c476b04e264;version=0?component_id=244994b5-4ae7-4e46-b3f7-5912a7ac1883&api_key=CometServer1&access_token=1598336230_urn%3Aaaid%3Asc%3AUS%3Ab9bafe78-9b7b-4d12-9709-9c476b04e264%3Bpublic_3daff014d358bc0c90a0e812d0ff5f0b250c356e",
    name: "Unity",
    shortDescription:
      "World's Leading Real-Time 2D And 3D Development Platform.",
    description: "World's Leading Real-Time 2D And 3D Development Platform.",
    medias: [
      "https://cdn-sharing.adobecc.com/id/urn:aaid:sc:US:b9bafe78-9b7b-4d12-9709-9c476b04e264;version=0?component_id=298d8198-1370-4e6d-8c34-11dc5d5d0efd&api_key=CometServer1&access_token=1598336230_urn%3Aaaid%3Asc%3AUS%3Ab9bafe78-9b7b-4d12-9709-9c476b04e264%3Bpublic_3daff014d358bc0c90a0e812d0ff5f0b250c356e",
    ],
    tags: [],
    visibility: "",
    entry: EntryOptions.Open,
    subjects: 20,
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
