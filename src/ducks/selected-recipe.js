// Actions
export const SELECTED_RECIPE = "cookbook/selected-recipe/SELECTED_RECIPE";
export const DEFAULT_RECIPE = "cookbook/selected-recipe/DEFAULT_RECIPE";


// Reducer
let initialState = {
    data: {}
};

export default function selectedRecipe(state = initialState, action) {
    switch (action.type) {
        case SELECTED_RECIPE:
            return {
                ...state,
                data: action.data
            };
        case DEFAULT_RECIPE:
            return {
                ...state,
                data: action.data
            };
        default:
            return state;
    }
}

// Action creators
export function selectRecipe(data) {
    return {
        type: SELECTED_RECIPE,
        data: data
    };
}

export function resetRecipe() {
    return {
        type: DEFAULT_RECIPE,
        data: {}
    };
}


