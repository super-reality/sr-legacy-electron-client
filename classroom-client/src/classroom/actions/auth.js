import axios from "axios"

export const AUTH_PENDING = "AUTH_PENDING";
export const authPending = () => {
    return {
        type: AUTH_PENDING,
        payload: {}
    };
};

export const AUTH_SUCCESSFUL = "AUTH_SUCCESSFUL";
export const authSuccessful = (token) => {
    return {
        type: AUTH_SUCCESSFUL,
        payload: {token}
    };
};

export const AUTH_FAILED = "AUTH_FAILED";
export const authFailed = errors => {
    return {
        type: AUTH_FAILED,
        payload: {errors}
    };
};

export const AUTH_INVALIDATED = "AUTH_INVALIDATED";
export const authInvalidated = () => {
    return {
        type: AUTH_INVALIDATED,
        payload: {}
    };
};

export const authenticate = (username, password) => dispatch => {
    dispatch(authPending());
    const requestTimeout = setTimeout(() => dispatch(authFailed([{message: "Request Timed Out"}])), 3000);
    return axios
        .post("http://localhost:3000/auth/new", {username, password}, {timeout: 3000})
        .then(response => {
            clearTimeout(requestTimeout);
            const {token} = response.data;
            dispatch(authSuccessful(token));
            return Promise.resolve();
        })
        .catch(error => {
            clearTimeout(requestTimeout);
            dispatch(authFailed([{message: error.response.statusText}]));
            return Promise.reject(error);
        });
};
