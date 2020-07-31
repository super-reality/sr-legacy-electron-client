import {ALERT_DISMISSED, ALERT_RECEIVED} from "../actions/alerts";

const initialState = []

export default (state = initialState, action) => {
    switch(action.type) {
        case ALERT_RECEIVED:
            const alert = action.payload;
            return [...state, alert]
        case ALERT_DISMISSED:
            const {id} = action.payload;
            return state.filter(alert => alert.id !== id);
        default:
            return state;
    }
};
