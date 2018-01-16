// recipes.js

// Actions
export const MENU_ITEM_ADDED = "cookbook/menu/MENU_ITEM_ADDED";
export const MENU_ITEM_DELETED = "cookbook/menu/MENU_ITEM_DELETED";
export const MENU_RESET = "cookbook/menu/MENU_RESET";


// Reducer
let menuArray = JSON.parse(localStorage.getItem('menu')) || [];

let initialState = {
    array: menuArray
};

export default function menu(state = initialState, action) {
    switch (action.type) {
        case MENU_ITEM_ADDED:
            return {
                ...state,
                array: state.array.push(action.data)
            };
        case MENU_ITEM_DELETED:
        return {
            ...state,
            array: state.array.filter(elem => elem !== action.data)
        };
        case MENU_RESET:
        return {
            ...state,
            array: action.data
        };
        default:
            return state;
    }
}

// Action creators
export function addToMenu(id) {
    return {
        type: MENU_ITEM_ADDED,
        data: id
    };
}

export function deleteFromMenu(id) {
    return {
        type: MENU_ITEM_DELETED,
        data: id
    };
}

export function resetMenu() {
    return {
        type: MENU_RESET,
        data: []
    };
}