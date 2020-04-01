export const INITIALIZE_USERS = "INITIALIZE_USERS";
export const initializeUsers = users => ({ type: INITIALIZE_USERS, users });
export const initializeUsersSocket = socket => dispatch => socket.once("initializeUsers", users => dispatch(initializeUsers(users)));;

export const USER_CONNECTED = "USER_CONNECTED";
export const connectUser = user => ({ type: USER_CONNECTED, user });

export const USER_DISCONNECTED = "USER_DISCONNECTED";
export const disconnectUser = user => ({ type: USER_DISCONNECTED, user });
