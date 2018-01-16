// temporary-recipe.js

// Actions
export const TEMP_DATA_ADDED = "cookbook/temporary-recipe/TEMP_DATA_ADDED";
export const TEMP_DATA_RESET = "cookbook/temporary-recipe/TEMP_DATA_RESET";

// Reducer
let initialState = {
    data: 
        {
            id: '',
            cooktime: {
                hours: '', 
                minutes: '', 
            },
            image: '',
            ingredients: [], 
            portions: '', 
            steps: '', 
            title: '',
            category: ''
        }
};

export default function tempData(state = initialState, action) {
    switch (action.type) {
        case TEMP_DATA_ADDED:
            return {
                ...state,
                data: action.data
            };
        case TEMP_DATA_RESET:
            return {
                ...state,
                data: action.data
            };
        default:
            return state;
    }
}

// Action creators
export function saveTempData(data) {
    return {
        type: TEMP_DATA_ADDED,
        data: data
    };
}

export function resetTempData() {
    return {
        type: TEMP_DATA_RESET,
        data: initialState.data
    };
}
