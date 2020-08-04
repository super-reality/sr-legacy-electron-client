import {AUTH_FAILED, AUTH_INVALIDATED, AUTH_PENDING, AUTH_SUCCESSFUL} from "../actions/auth";

const initialState = {
    isValid: false,
    isPending: false,
    updatedAt: Date.now(),
    token: null
};

export default (state = initialState, action) => {
    const updatedAt = Date.now();
    switch(action.type) {
        case AUTH_PENDING:
            return {
                ...state,
                isPending: true,
                isValid: false,
                updatedAt
            }
        case AUTH_SUCCESSFUL:
            const {token} = action.payload;
            return {
                ...state,
                isPending: false,
                isValid: true,
                updatedAt,
                token
            };
        case AUTH_FAILED:
            return {
                ...state,
                isPending: false,
                isValid: false,
                updatedAt
            };
        case AUTH_INVALIDATED:
            return {
                ...state,
                isPending: false,
                isValid: false,
                updatedAt
            };
        default:
            return state;
    }
};
