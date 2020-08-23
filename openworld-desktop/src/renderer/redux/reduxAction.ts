import { Dispatch, AnyAction } from "@reduxjs/toolkit";
import { actions, ActionKeys } from "./actions";

type DispatchParameter<K extends ActionKeys> = {
  type: K;
  arg: Parameters<typeof actions[K]>[0];
};

/**
 * Dispatch a redux action to the main store and (if required) relay it to other processes
 * @param dispatch Dispatcher
 * @param type Action type
 * @param arg argument / object
 */
export default function reduxAction<K extends ActionKeys>(
  dispatch: Dispatch<AnyAction>,
  action: DispatchParameter<K>
): void {
  // @ts-ignore: Unreachable code error
  dispatch(actions[action.type](action.arg));
}
