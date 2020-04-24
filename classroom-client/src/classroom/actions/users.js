import axios from "axios"
import {authInvalidated} from "./auth";

export const USERS_REQUEST_PENDING = "USERS_REQUEST_PENDING";
export const usersRequestPending = () => ({type: USERS_REQUEST_PENDING});

export const USERS_REQUEST_FAILED = "USERS_REQUEST_FAILED";
export const usersRequestFailed = () => ({type: USERS_REQUEST_FAILED});

export const USERS_RESOURCE_HYDRATED = "USERS_INDEX_SUCCESSFUL";
export const usersResourceHydrated = users => ({type: USERS_RESOURCE_HYDRATED, payload: {users}});

export const USERS_ITEM_CREATED = "USERS_ITEM_CREATED";
export const usersItemCreated = user => ({type: USERS_ITEM_CREATED, payload: {user}});

export const USERS_ITEM_READ = "USERS_ITEM_READ";
export const usersItemRead = user => ({type: USERS_ITEM_READ, payload: {user}});

export const USERS_ITEM_UPDATED = "USERS_ITEM_UPDATED";
export const usersItemUpdated = user => ({type: USERS_ITEM_UPDATED, payload: {user}});

export const USERS_ITEM_DESTROYED = "USERS_ITEM_DESTROYED";
export const usersItemDestroyed = user => ({type: USERS_ITEM_DESTROYED, payload: {user}});

export const hydrateUsers = () => (dispatch, getState) => {
    dispatch(usersRequestPending());
    return axios
        .get("http://localhost:3000/api/v1/users", {headers: {Authorization: `Bearer ${getState().auth.token}`}, timeout: 3000})
        .then(response => {
            const {users} = response.data;
            dispatch(usersResourceHydrated(users));
            return Promise.resolve(users);
        })
        .catch(error => {
            dispatch(usersRequestFailed());
            if(error.response.status === 401) {
                dispatch(authInvalidated());
            }
            return Promise.reject(error);
        });
};

export const createUser = data => (dispatch, getState) => {
    dispatch(usersRequestPending());
    return axios
        .post("http://localhost:3000/api/v1/users", data, {headers: {Authorization: `Bearer ${getState().auth.token}`}, timeout: 3000})
        .then(response => {
            const {user} = response.data;
            dispatch(usersItemCreated(user));
            return Promise.resolve(user);
        })
        .catch(error => {
            dispatch(usersRequestFailed());
            if(error.response.status === 401) {
                dispatch(authInvalidated());
            }
            return Promise.reject(error);
        });
};

export const readUser = userId => (dispatch, getState) => {
    dispatch(usersRequestPending());
    return axios
        .get(`http://localhost:3000/api/v1/users/${userId}`, {headers: {Authorization: `Bearer ${getState().auth.token}`}, timeout: 3000})
        .then(response => {
            const {user} = response.data;
            dispatch(usersItemRead(user));
            return Promise.resolve(user);
        })
        .catch(error => {
            dispatch(usersRequestFailed());
            if(error.response.status === 401) {
                dispatch(authInvalidated());
            }
            return Promise.reject(error);
        });
};

export const updateUser = (userId, data) => (dispatch, getState) => {
    dispatch(usersRequestPending());
    return axios
        .put(`http://localhost:3000/api/v1/users/${userId}`, data, {headers: {Authorization: `Bearer ${getState().auth.token}`}, timeout: 3000})
        .then(response => {
            const {user} = response.data;
            dispatch(usersItemUpdated(user));
            return Promise.resolve(user);
        })
        .catch(error => {
            dispatch(usersRequestFailed());
            if(error.response.status === 401) {
                dispatch(authInvalidated());
            }
            return Promise.reject(error);
        });
};

export const destroyUser = userId => (dispatch, getState) => {
    dispatch(usersRequestPending());
    return axios
        .delete(`http://localhost:3000/api/v1/users/${userId}`, {headers: {Authorization: `Bearer ${getState().auth.token}`}, timeout: 3000})
        .then(response => {
            const {user} = response.data;
            dispatch(usersItemDestroyed(user));
            return Promise.resolve(user);
        })
        .catch(error => {
            dispatch(usersRequestFailed());
            if(error.response.status === 401) {
                dispatch(authInvalidated());
            }
            return Promise.reject(error);
        });
};
