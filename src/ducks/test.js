// progress.js

// Actions
export const TEST = "cookbook/test/TEST_PASSED";

// Reducer
let initialState = {
    test: 0
};

export default function testReducer(state = initialState, action) {
    switch (action.type) {
        case TEST:
            return {
                ...state,
                test: state.test + action.test,
            };
        default:
            return state;
    }
}

// Action creators
export function testActionCreator(num) {
    return {
        type: TEST,
        test: num
    };
}

