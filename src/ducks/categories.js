// categories.js

// Actions
export const CATEGORY_ADDED = "cookbook/category/CATEGORY_ADDED";
export const CATEGORY_DELETED = "cookbook/category/CATEGORY_DELETED";

// Reducer
let categoriesArray = JSON.parse(localStorage.getItem('categories')) || [];
let count = categories.length;

let initialState = {
    count: count,
    array: categoriesArray
};

export default function categories(state = initialState, action) {
    switch (action.type) {
        case CATEGORY_ADDED:
            return {
                ...state,
                count: state.count + action.step,
                array: action.data
            };
        case CATEGORY_DELETED:
        return {
            ...state,
            count: state.count - action.step,
            array: action.data
        };
        default:
            return state;
    }
}

// Action creators
export function addCategory(data) {
    return {
        type: CATEGORY_ADDED,
        step: 1,
        data: data
    };
}

export function deleteCategory(data) {
    return {
        type: CATEGORY_DELETED,
        step: 1,
        data: data
    };
}

