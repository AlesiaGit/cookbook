// shopping-list.js

// Actions
export const SHOPPING_LIST_CREATED = "cookbook/shopping-list/SHOPPING_LIST_CREATED";
export const SHOPPING_LIST_DELETED = "cookbook/shopping-list/SHOPPING_LIST_DELETED";


// Reducer
let initialState = {
    recipes: [],
    ingredients: []
};

export default function shoppingList(state = initialState, action) {
    switch (action.type) {
        case SHOPPING_LIST_CREATED:
            return {
                ...state,
                recipes: action.recipes,
                ingredients: action.ingredients
            };
        case SHOPPING_LIST_DELETED:
            return {
                ...state,
                recipes: [],
                ingredients: []
            };
        default:
            return state;
    }
}

// Action creators
export function shoppingListCreated(list) {
    return {
        type: SHOPPING_LIST_CREATED,
        recipes: list.recipes,
        ingredients: list.ingredients
    };
}

export function shoppingListDeleted() {
    return {
        type: SHOPPING_LIST_DELETED,
        recipes: [],
        ingredients: []
    };
}
