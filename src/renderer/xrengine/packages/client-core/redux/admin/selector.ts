import { createSelector } from "reselect";

const selectState = (state: any): any => state.get("admin");
// eslint-disable-next-line import/prefer-default-export
export const selectAdminState = createSelector([selectState], (admin) => admin);
