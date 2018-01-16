// selectedCategory.js
import settings from "../config";

// Actions
export const SELECTED_CATEGORY = "cookbook/selected-category/SELECTED_CATEGORY";
export const DEFAULT_CATEGORY = "cookbook/selected-category/DEFAULT_CATEGORY";


// Reducer
let initialState = {
    data: settings.defaultCategory
};

export default function selectedCategory(state = initialState, action) {
    switch (action.type) {
        case SELECTED_CATEGORY:
            return {
                ...state,
                data: action.data
            };
        case DEFAULT_CATEGORY:
            return {
                ...state,
                data: action.data
            };
        default:
            return state;
    }
}

// Action creators
export function changeCategory(data) {
    return {
        type: SELECTED_CATEGORY,
        data: data
    };
}

export function resetCategory() {
    return {
        type: DEFAULT_CATEGORY,
        data: settings.defaultCategory
    };
}


