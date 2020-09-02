import 'jquery.validate'
import handlebars from "handlebars"
import amd from '../amd'
import storeManager from '../../modules/store/store.js'
import reducers from './reducers'
import {loggingMiddleware} from "./middleware";

if (amd) {
    module.exports = { init: () => amd.require([
        'vendor.passwordValidate',
    ], init) };
} else {
    module.exports = { init: () => {} };
}

function createStore() {
    return storeManager.createStore(reducers, {
        hello: {
            word: "world",
        },
        counter: {
            value: 0,
        },
    }, [ loggingMiddleware ]);
}

function makeRenderer(root) {
    const bodyTemplate = handlebars.compile(document.getElementById("psp-template-hbs").innerHTML);
    const render = (state) => {
        const newHTML = bodyTemplate(state);
        if(render.compareState(state) && render.compareTemplate(newHTML)) {
            console.log("render triggered!");
            root.innerHTML = newHTML;
            render.state = state;
            render.prev = newHTML;
        }
    };

    render.compareState = (newState) => render.state !== newState;
    render.compareTemplate = (newTemplate) => render.prev !== newTemplate;
    return render;
}

function safeParseJSON(value) {
    try {
        return JSON.parse(value)
    }
    catch (err) {
        console.log("?", err);
        return value;
    }
}

function init(validator) {
    const root = document.querySelector("[data-root-psp]");
    const [ store ] = createStore();
    const render = makeRenderer(root);
    store.subscribe(render);
    root.addEventListener("click", function(event) {
        const el = event.target;
        const cev = el.getAttribute("data-click");
        if(cev) {
            store.dispatch({
                type: cev,
                payload: safeParseJSON(el.getAttribute("data-payload")),
            })
        }
    });
}
