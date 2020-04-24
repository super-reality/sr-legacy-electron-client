import {
    USERS_REQUEST_FAILED,
    USERS_REQUEST_PENDING,
    USERS_RESOURCE_HYDRATED,
    USERS_ITEM_CREATED,
    USERS_ITEM_READ, USERS_ITEM_UPDATED, USERS_ITEM_DESTROYED
} from "../actions/users";

const initialState = {
    isPending: false,
    updatedAt: Date.now(),
    users: []
};

export default (state = initialState, action) => {
    const updatedAt = Date.now();
    switch(action.type) {
        case USERS_REQUEST_PENDING:
            return {
                ...state,
                isPending: true,
                updatedAt
            }
        case USERS_REQUEST_FAILED:
            return {
                ...state,
                isPending: false,
                updatedAt
            };
        case USERS_RESOURCE_HYDRATED:
            return {
                ...state,
                isPending: false,
                updatedAt,
                users: action.payload.users
            };
        case USERS_ITEM_CREATED:
            return {
                ...state,
                isPending: false,
                updatedAt,
                users: [...state.users, action.payload.user]
            };
        case USERS_ITEM_READ:
            return {
                ...state,
                isPending: false,
                updatedAt,
                users: [...state.users.filter(user => user.id !== action.payload.user.id), action.payload.user]
            };
        case USERS_ITEM_UPDATED:
            return {
                ...state,
                isPending: false,
                updatedAt,
                users: [...state.users.filter(user => user.id !== action.payload.user.id), action.payload.user]
            };
        case USERS_ITEM_DESTROYED:
            return {
                ...state,
                isPending: false,
                updatedAt,
                users: state.users.filter(user => user.id !== action.payload.user.id)
            };
        default:
            return state;
    }
};
