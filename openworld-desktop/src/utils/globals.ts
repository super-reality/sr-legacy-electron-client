import { useSelector, useDispatch } from "react-redux";
import { useCallback } from "react";
import { bool } from "aws-sdk/clients/signer";
import { AppState } from "../renderer/redux/stores/renderer";
import reduxAction from "../renderer/redux/reduxAction";

// const dispatch = useDispatch();
// const gSetLoadingState = (_entry: bool) =>
//   reduxAction(dispatch, { type: "SET_LOADING_STATE", arg: _entry });

// export default gSetLoadingState;
