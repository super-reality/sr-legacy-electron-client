import axios from "axios"
import localForage from "localforage";

export const AUTH_PENDING = "AUTH_PENDING";
export const authPending = () => ({type: AUTH_PENDING});

export const AUTH_SUCCESSFUL = "AUTH_SUCCESSFUL";
export const authSuccessful = (token) => ({type: AUTH_SUCCESSFUL, payload: {token}});

export const AUTH_FAILED = "AUTH_FAILED";
export const authFailed = () => ({type: AUTH_FAILED});

export const AUTH_INVALIDATED = "AUTH_INVALIDATED";
export const authInvalidated = () => ({type: AUTH_INVALIDATED});

export const authenticate = (username, password) => dispatch => {
    dispatch(authPending());
    return axios
        .post("http://localhost:3000/api/v1/auth/new", {username, password}, {timeout: 3000})
        .then(response => {
            const {token} = response.data;
            return localForage
                .setItem("com.gamegen.classroom.auth.token", token)
                .then(value => Promise.resolve(value))
                .catch(error => Promise.reject(error));
        })
        .then(token => {
            dispatch(authSuccessful(token));
            return Promise.resolve();
        })
        .catch(error => {
            dispatch(authFailed());
            return Promise.reject(error);
        });
};

export const authenticateFromLocalStorage = () => dispatch => {
    dispatch(authPending());
    return localForage
        .getItem("com.gamegen.classroom.auth.token")
        .then(token => {
            if(token) {
                return axios
                    .post("http://localhost:3000/api/v1/auth/verify", null, {headers: {Authorization: `Bearer ${token}`}, timeout: 3000})
                    .then(response => Promise.resolve(token))
                    .catch(error => Promise.reject(error))
            }
            else {
                return Promise.reject();
            }
        })
        .then(token => {
            dispatch(authSuccessful(token));
            return Promise.resolve();
        })
        .catch(error => {
            return dispatch(signOut()).then(() => Promise.reject(error));
        });
};

export const signOut = () => dispatch => {
    dispatch(authInvalidated());
    return localForage.removeItem("com.gamegen.classroom.auth.token")
}
