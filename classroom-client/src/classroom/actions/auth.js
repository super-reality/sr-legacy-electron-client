import axios from "axios"

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
            dispatch(authSuccessful(token));
            return Promise.resolve();
        })
        .catch(error => {
            dispatch(authFailed());
            return Promise.reject(error);
        });
};
