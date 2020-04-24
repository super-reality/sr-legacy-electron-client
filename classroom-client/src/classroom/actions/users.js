import axios from "axios"
import {authInvalidated} from "./auth";

export const USERS_INDEX_PENDING = "USERS_INDEX_PENDING";
export const usersIndexPending = () => ({type: USERS_INDEX_PENDING});

export const USERS_INDEX_SUCCESSFUL = "USERS_INDEX_SUCCESSFUL";
export const usersIndexSuccessful = (users) => ({type: USERS_INDEX_SUCCESSFUL, payload: {users}});

export const USERS_INDEX_FAILED = "USERS_INDEX_FAILED";
export const usersIndexFailed = () => ({type: USERS_INDEX_FAILED});

export const USERS_INDEX_INVALIDATED = "USERS_INDEX_INVALIDATED";
export const usersIndexInvalidated = () => ({type: USERS_INDEX_INVALIDATED});

export const hydrate = () => (dispatch, getState) => {
    dispatch(usersIndexPending());
    return axios
        .get("http://localhost:3000/api/v1/users", {headers: {Authorization: `Bearer ${getState().auth.token}`}, timeout: 3000})
        .then(response => {
            const {users} = response.data;
            dispatch(usersIndexSuccessful(users));
            return Promise.resolve(users);
        })
        .catch(error => {
            dispatch(usersIndexFailed());
            if(error.response.status === 401) {
                dispatch(authInvalidated());
            }
            return Promise.reject(error);
        });
};
