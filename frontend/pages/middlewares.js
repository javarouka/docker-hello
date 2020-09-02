import {isFunction} from "../../modules/common/tagChecker";

export const loggingMiddleware = store => {
    return next => {
        return action => {
            if(isFunction(action)) {
                return next(action);
            }
            const prevState = store.getState();
            const result = next(action);
            console.groupCollapsed("dispatch", action);
            console.log("prevState", prevState);
            console.log("nextState", store.getState());
            console.groupEnd();
            return result;
        };
    };
};
