import {
    CLASSROOMS_REQUEST_FAILED,
    CLASSROOMS_REQUEST_PENDING,
    CLASSROOMS_RESOURCE_HYDRATED,
    CLASSROOMS_ITEM_CREATED,
    CLASSROOMS_ITEM_READ, CLASSROOMS_ITEM_UPDATED, CLASSROOMS_ITEM_DESTROYED
} from "../actions/classrooms";

const initialState = {
    isPending: false,
    updatedAt: Date.now(),
    classrooms: []
};

export default (state = initialState, action) => {
    const updatedAt = Date.now();
    switch(action.type) {
        case CLASSROOMS_REQUEST_PENDING:
            return {
                ...state,
                isPending: true,
                updatedAt
            }
        case CLASSROOMS_REQUEST_FAILED:
            return {
                ...state,
                isPending: false,
                updatedAt
            };
        case CLASSROOMS_RESOURCE_HYDRATED:
            return {
                ...state,
                isPending: false,
                updatedAt,
                classrooms: action.payload.classrooms
            };
        case CLASSROOMS_ITEM_CREATED:
            return {
                ...state,
                isPending: false,
                updatedAt,
                classrooms: [...state.classrooms, action.payload.classroom]
            };
        case CLASSROOMS_ITEM_READ:
            return {
                ...state,
                isPending: false,
                updatedAt,
                classrooms: [...state.classrooms.filter(classroom => classroom.id !== action.payload.classroom.id), action.payload.classroom]
            };
        case CLASSROOMS_ITEM_UPDATED:
            return {
                ...state,
                isPending: false,
                updatedAt,
                classrooms: [...state.classrooms.filter(classroom => classroom.id !== action.payload.classroom.id), action.payload.classroom]
            };
        case CLASSROOMS_ITEM_DESTROYED:
            return {
                ...state,
                isPending: false,
                updatedAt,
                classrooms: state.classrooms.filter(classroom => classroom.id !== action.payload.classroom.id)
            };
        default:
            return state;
    }
};
