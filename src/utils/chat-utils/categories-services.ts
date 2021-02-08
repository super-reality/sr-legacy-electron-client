import { CategorySettings } from "../../types/chat";
import { categoryClient } from "./services";

export const createCategory = (groupId: string) => {
  categoryClient
    .create({
      groupId,
      categoryName: "New Category",
    })
    .catch((err: any) => {
      console.log(err);
    });
};
export function updateCategory(id: string, categorySettings: CategorySettings) {
  categoryClient.patch(id, categorySettings);
}

export type UpdateCategoryType = typeof updateCategory;
