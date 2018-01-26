// login.js

// Actions
export const USER_LOGGED_IN = "cookbook/login/USER_LOGGED_IN";
export const USER_LOGGED_OUT = "cookbook/login/USER_LOGGED_OUT";

let uid = localStorage.getItem('uid') || "undefined";

// Reducer
let initialState = {
    uid: uid
};

export default function login(state = initialState, action) {
    switch (action.type) {
        case USER_LOGGED_IN:
            return { 
                ...state,
                uid: action.uid 
            };
        case USER_LOGGED_OUT:
            return { 
                ...state,
                uid: action.uid
            };
        default:
            return state;
    }
}

// Action creators
export function userLoggedIn(uid) {
    return {
        type: USER_LOGGED_IN,
        uid: uid
    };
}

export function userLoggedOut() {
    return {
        type: USER_LOGGED_OUT,
        uid: 'undefined'
    };
}



