import {AUTH_FAILED, AUTH_INVALIDATED, AUTH_PENDING, AUTH_SUCCESSFUL} from "../actions/auth";

const initialState = {
    isValid: false,
    isFetching: false,
    updatedAt: Date.now(),
    token: null
};

export default (state = initialState, action) => {
    const updatedAt = Date.now();
    switch(action.type) {
        case AUTH_PENDING:
            return {
                ...state,
                isFetching: true,
                isValid: false,
                updatedAt
            }
        case AUTH_SUCCESSFUL:
            const {token} = action.payload;
            return {
                ...state,
                isFetching: false,
                isValid: true,
                updatedAt,
                token
            };
        case AUTH_FAILED:
            return {
                ...state,
                isFetching: false,
                isValid: false,
                updatedAt
            };
        case AUTH_INVALIDATED:
            return {
                ...state,
                isFetching: false,
                isValid: false,
                updatedAt
            };
        default:
            return state;
    }
};
