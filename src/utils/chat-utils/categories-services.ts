import { Category, CategorySettings } from "../../types/chat";
import { createChannel } from "./channels-services";
import { categoryClient } from "./services";

export const getCategory = (id: string) => {
  categoryClient
    .find({
      query: {
        _id: id,
      },
    })
    .then((res: any) => {
      console.log("get Category", res);
    });
};

export const createCategory = (groupId: string) => {
  categoryClient
    .create({
      groupId,
      categoryName: "New Group Category",
    })
    .then((category: Category) => {
      createChannel(category._id, "new text channel");
    })
    .catch((err: any) => {
      console.log(err);
    });
};
export function updateCategory(id: string, categorySettings: CategorySettings) {
  categoryClient.patch(id, categorySettings);
}

export type UpdateCategoryType = typeof updateCategory;
