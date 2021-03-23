import { createSelector } from "reselect";

const selectState = (state: any): any => state.get("alert");
// eslint-disable-next-line import/prefer-default-export
export const selectAlertState = createSelector([selectState], (alert) => alert);
