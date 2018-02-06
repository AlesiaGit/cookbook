// menu.js
import { recipesToIngredients } from "../utils/recipesToIngredients";

// Actions
export const MENU_UPDATED = "cookbook/menu/MENU_UPDATED";
export const INGREDIENTS_UPDATED = "cookbook/menu/INGREDIENTS_UPDATED";
export const MENU_RESET = "cookbook/menu/MENU_RESET";


// Reducer

let initialState = {
    recipes: [],
    ingredients: [],
};

export default function menu(state = initialState, action) {
    switch (action.type) {
        case MENU_UPDATED:
            return {
                ...state,
                recipes: action.recipes,
                ingredients: action.ingredients
            };
        case INGREDIENTS_UPDATED:
            return {
                ...state,
                recipes: action.recipes,
                ingredients: action.ingredients
            };
        case MENU_RESET:
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
export function updateMenu(recipes) {
    return {
        type: MENU_UPDATED,
        recipes: recipes,
        ingredients: recipesToIngredients(recipes)
    };
}

export function updateIngredients(menu) {
    return {
        type: INGREDIENTS_UPDATED,
        recipes: menu.recipes,
        ingredients: menu.ingredients
    };
}

export function resetMenu() {
    return {
        type: MENU_RESET
    };
}