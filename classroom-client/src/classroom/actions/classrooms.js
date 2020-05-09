import axios from "axios"
import {signOut} from "./auth";

export const CLASSROOMS_REQUEST_PENDING = "CLASSROOMS_REQUEST_PENDING";
export const classroomsRequestPending = () => ({type: CLASSROOMS_REQUEST_PENDING});

export const CLASSROOMS_REQUEST_FAILED = "CLASSROOMS_REQUEST_FAILED";
export const classroomsRequestFailed = () => ({type: CLASSROOMS_REQUEST_FAILED});

export const CLASSROOMS_RESOURCE_HYDRATED = "CLASSROOMS_INDEX_SUCCESSFUL";
export const classroomsResourceHydrated = classrooms => ({type: CLASSROOMS_RESOURCE_HYDRATED, payload: {classrooms}});

export const CLASSROOMS_ITEM_CREATED = "CLASSROOMS_ITEM_CREATED";
export const classroomsItemCreated = classroom => ({type: CLASSROOMS_ITEM_CREATED, payload: {classroom}});

export const CLASSROOMS_ITEM_READ = "CLASSROOMS_ITEM_READ";
export const classroomsItemRead = classroom => ({type: CLASSROOMS_ITEM_READ, payload: {classroom}});

export const CLASSROOMS_ITEM_UPDATED = "CLASSROOMS_ITEM_UPDATED";
export const classroomsItemUpdated = classroom => ({type: CLASSROOMS_ITEM_UPDATED, payload: {classroom}});

export const CLASSROOMS_ITEM_DESTROYED = "CLASSROOMS_ITEM_DESTROYED";
export const classroomsItemDestroyed = classroom => ({type: CLASSROOMS_ITEM_DESTROYED, payload: {classroom}});

export const hydrateClassrooms = () => (dispatch, getState) => {
    dispatch(classroomsRequestPending());
    return axios
        .get("http://localhost:3000/api/v1/classrooms", {headers: {Authorization: `Bearer ${getState().auth.token}`}, timeout: 3000})
        .then(response => {
            const {classrooms} = response.data;
            dispatch(classroomsResourceHydrated(classrooms));
            return Promise.resolve(classrooms);
        })
        .catch(error => {
            dispatch(classroomsRequestFailed());
            if(error.response.status === 401) {
                dispatch(signOut());
            }
            return Promise.reject(error);
        });
};

export const createClassroom = data => (dispatch, getState) => {
    dispatch(classroomsRequestPending());
    return axios
        .post("http://localhost:3000/api/v1/classrooms", data, {headers: {Authorization: `Bearer ${getState().auth.token}`}, timeout: 3000})
        .then(response => {
            const {classroom} = response.data;
            dispatch(classroomsItemCreated(classroom));
            return Promise.resolve(classroom);
        })
        .catch(error => {
            dispatch(classroomsRequestFailed());
            if(error.response.status === 401) {
                dispatch(signOut());
            }
            return Promise.reject(error);
        });
};

export const readClassroom = classroomId => (dispatch, getState) => {
    dispatch(classroomsRequestPending());
    return axios
        .get(`http://localhost:3000/api/v1/classrooms/${classroomId}`, {headers: {Authorization: `Bearer ${getState().auth.token}`}, timeout: 3000})
        .then(response => {
            const {classroom} = response.data;
            dispatch(classroomsItemRead(classroom));
            return Promise.resolve(classroom);
        })
        .catch(error => {
            dispatch(classroomsRequestFailed());
            if(error.response.status === 401) {
                dispatch(signOut());
            }
            return Promise.reject(error);
        });
};

export const updateClassroom = (classroomId, data) => (dispatch, getState) => {
    dispatch(classroomsRequestPending());
    return axios
        .patch(`http://localhost:3000/api/v1/classrooms/${classroomId}`, data, {headers: {Authorization: `Bearer ${getState().auth.token}`}, timeout: 3000})
        .then(response => {
            const {classroom} = response.data;
            dispatch(classroomsItemUpdated(classroom));
            return Promise.resolve(classroom);
        })
        .catch(error => {
            dispatch(classroomsRequestFailed());
            if(error.response.status === 401) {
                dispatch(signOut());
            }
            return Promise.reject(error);
        });
};

export const destroyClassroom = classroomId => (dispatch, getState) => {
    dispatch(classroomsRequestPending());
    return axios
        .delete(`http://localhost:3000/api/v1/classrooms/${classroomId}`, {headers: {Authorization: `Bearer ${getState().auth.token}`}, timeout: 3000})
        .then(response => {
            const {classroom} = response.data;
            dispatch(classroomsItemDestroyed(classroom));
            return Promise.resolve(classroom);
        })
        .catch(error => {
            dispatch(classroomsRequestFailed());
            if(error.response.status === 401) {
                dispatch(signOut());
            }
            return Promise.reject(error);
        });
};
