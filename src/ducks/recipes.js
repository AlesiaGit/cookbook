// recipes.js

// Actions
export const RECIPE_ADDED = "cookbook/recipes/RECIPE_ADDED";
export const RECIPE_DELETED = "cookbook/recipes/RECIPE_DELETED";

// Reducer
let recipesArray = JSON.parse(localStorage.getItem('recipes')) || [];
let count = recipes.length;

let initialState = {
    count: count,
    array: recipesArray
};

export default function recipes(state = initialState, action) {
    switch (action.type) {
        case RECIPE_ADDED:
            return {
                ...state,
                count: state.count + action.step,
                array: action.data
            };
        case RECIPE_DELETED:
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
export function addRecipe(data) {
    return {
        type: RECIPE_ADDED,
        step: 1,
        data: data
    };
}

export function deleteRecipe(data) {
    return {
        type: RECIPE_DELETED,
        step: 1,
        data: data
    };
}



