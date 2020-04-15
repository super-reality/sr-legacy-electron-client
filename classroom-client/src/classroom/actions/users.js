import axios from "axios"

export const USERS_INDEX_PENDING = "USERS_INDEX_PENDING";
export const usersIndexPending = () => {
    return {
        type: USERS_INDEX_PENDING,
        payload: {}
    };
};

export const USERS_INDEX_SUCCESSFUL = "USERS_INDEX_SUCCESSFUL";
export const usersIndexSuccessful = (users) => {
    return {
        type: USERS_INDEX_SUCCESSFUL,
        payload: {users}
    };
};

export const USERS_INDEX_FAILED = "USERS_INDEX_FAILED";
export const usersIndexFailed = errors => {
    return {
        type: USERS_INDEX_FAILED,
        payload: {errors}
    };
};

export const USERS_INDEX_INVALIDATED = "USERS_INDEX_INVALIDATED";
export const usersIndexInvalidated = () => {
    return {
        type: USERS_INDEX_INVALIDATED,
        payload: {}
    };
};

export const hydrate = (authToken) => dispatch => {
    dispatch(usersIndexPending());
    const requestTimeout = setTimeout(() => dispatch(usersIndexFailed([{message: "Request Timed Out"}])), 3000);
    axios
        .get("http://localhost:3000/users", {headers: {Authorization: `Bearer ${authToken}`}, timeout: 3000})
        .then(response => {
            clearTimeout(requestTimeout);
            const {users} = response.data;
            dispatch(usersIndexSuccessful(users));
        })
        .catch(error => {
            clearTimeout(requestTimeout);
            dispatch(usersIndexFailed([{message: error.response.statusText}]));
        });
};
