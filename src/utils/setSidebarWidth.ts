import store from "../renderer/redux/stores/renderer";
import reduxAction from "../renderer/redux/reduxAction";

export function setSidebarWidth(width: number): void {
  reduxAction(store.dispatch, {
    type: "SET_CONTENT_WIDTH",
    arg: {
      width,
    },
  });
}

export function resetSidebarWidth(): void {
  reduxAction(store.dispatch, {
    type: "SET_CONTENT_WIDTH",
    arg: {
      width: 0,
    },
  });
}
