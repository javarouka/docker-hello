import {isFunction, isString} from "../common/tagChecker";

function isValidAction(action) {
    return action && (isString(action.type) || isFunction(action))
}

function applyMiddleware(store, middleware) {
    let dispatch = (action) => {
        return store.dispatch(action);
    };
    const mockStore = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args),
    };
    middleware = middleware.slice();
    const chain = middleware.map((m) => m(mockStore));
    dispatch = chain.reduce((fi, se) => {
        return (...args) => fi(se(...args))
    })(store.dispatch);

    return {
        ...store,
        dispatch
    }
}

function Store(reducer, initialState = {}, middlewares = []) {
    const subscribers = [];
    let state = {
        ...Object.create(null),
        ...initialState
    };

    const getState = () => {
        return state
    };

    const dispatch = (action) => {
        if(!isValidAction(action)) {
            return;
        }
        if(isFunction(action)) {
            action(dispatch, getState);
            return;
        }

        state = reducer(state, action);
        subscribers.forEach(sub => {
            sub(state);
        });
    };

    const subscribe = (fn) => {
        fn(getState());
        const len = subscribers.push(fn);
        return () => {
            subscribers.splice(len - 1, 1)
        }
    };

    const store = {
        getState,
        dispatch,
        subscribe,
    };

    return applyMiddleware(store, middlewares);
}

let storeId = 0;
const stores = new Map();

export default {
    combineReducers(reducers) {
        const reducerKeys = Object.keys(reducers);
        return function combination(state = {}, action) {
            const nextState = {};
            for (let i = 0; i < reducerKeys.length; i++) {
                const key = reducerKeys[i];
                const reducer = reducers[key];
                const prevState = state[key];
                nextState[key] = reducer(prevState, action);
            }
            return nextState;
        }
    },
    createStore(reducer, initialState = {}, middleware = [], name = `store_${++storeId}`) {
        if(stores.has(name)) {
            return [ stores.get(name), name ]
        }
        const store = Store(reducer, initialState, middleware);
        stores.set(name, store);
        return [ store, name ]
    }
}
