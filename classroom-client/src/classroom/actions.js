import axios from "axios"

export const AUTHENTICATION_SUCCESS = "AUTHENTICATION_SUCCESS";
export const authenticationSuccess = auth => ({type: AUTHENTICATION_SUCCESS, payload: auth});

export const AUTHENTICATION_FAILURE = "AUTHENTICATION_FAILURE";
export const authenticationFailure = error => ({type: AUTHENTICATION_FAILURE, payload: error});

export const AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
export const authenticationError = error => ({type: AUTHENTICATION_ERROR, payload: error});

export const authenticateCredentials = (credentials, callback) => dispatch => {
    axios
        .post("http://localhost:3000/auth", credentials)
        .then(response => {
            const { success, payload, error } = response.data;
            if(success) {
                dispatch(authenticationSuccess(payload));
            }
            else {
                dispatch(authenticationFailure(error));
            }
        })
        .catch(error => dispatch(authenticationError(error)));
};

export const CLASSES_LOAD_SUCCESS = "CLASSES_LOAD_SUCCESS";
export const classesLoadSuccess = auth => ({type: CLASSES_LOAD_SUCCESS, payload: auth});

export const CLASSES_LOAD_FAILURE = "CLASSES_LOAD_FAILURE";
export const classesLoadFailure = error => ({type: CLASSES_LOAD_FAILURE, payload: error});

export const CLASSES_LOAD_ERROR = "CLASSES_LOAD_ERROR";
export const classesLoadError = error => ({type: CLASSES_LOAD_ERROR, payload: error});

export const requestClasses = auth => dispatch => {
    axios
        .get("http://localhost:3000/classes", {params: {token: auth.token}})
        .then(response => {
            const { success, payload, error } = response.data;
            if(success) {
                dispatch(classesLoadSuccess(payload));
            }
            else {
                dispatch(classesLoadFailure(error));
            }
        })
        .catch(error => dispatch(classesLoadError(error)));
};
