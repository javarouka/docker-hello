import storeManager from "../../modules/store/store";

const reduceHello = (state, action) => {
    const {
        type,
        payload
    } = action;
    switch (type) {
        case "Hello": return {
            ...state,
            hello: payload
        };
        default: return state
    }
};
const reduceCount = (state, action) => {
    const {
        type,
    } = action;
    switch (type) {
        case "Inc": return {
            ...state,
            value: state.value + 1,
        };
        case "Dec": return {
            ...state,
            value: state.value - 1,
        };
        default: return state
    }
};

export default storeManager.combineReducers({
    hello: reduceHello,
    counter: reduceCount,
});
