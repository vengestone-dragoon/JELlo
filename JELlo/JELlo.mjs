export const JELloEvents = {
    reRender: "JELloReRender"
}

export class JELloElement extends HTMLElement {
    constructor() {
        super();
        this._update = (message) => {};
        this._view = () => {};
    }
    connectedCallback(update,view) {
        if (update) {
            this._update = (message) => {return update(message)};
        } else {
            console.log('JELlo element missing update!');
        }
        if (view) {
            this._view = () => { return view()};
        } else {
            console.log('JELlo element missing view!');
        }
        addEventListener("JELloInternal", (event) => {
            if (event.detail) {
                switch (event.detail.name) {
                    case "JELloReRender": {
                        this.render();
                        break;
                    }
                    default: {
                        dispatchEvent(new CustomEvent("JELlo", { detail: event.detail }));
                        break;
                    }
                }
            }
        })
        addEventListener("JELlo",(event) => {
            if (event.detail) {
                let result = this._update(event.detail);
                if (result) {
                    dispatchEvent(new CustomEvent("JELloInternal", { detail: result }));
                }
            }
        })
        this.render();
    }
    render() {
        this.childNodes.forEach((childNode) => {
            childNode.remove();
        });
        let content = this._view();
        if (Array.isArray(content)) {
            content.forEach((item) => {
                this.render_item(item);
            })
        } else if (content instanceof HTMLElement) {
            this.appendChild(content);
        } else if (typeof content === "string") {
            this.appendChild(document.createTextNode(content));
        }
    }
    render_item(item) {
        if (Array.isArray(item)) {
            item.forEach((item) => {
                this.render_item(item);
            })
        } else if (item instanceof HTMLElement) {
            this.appendChild(item);
        } else if (typeof item === "string") {
            this.appendChild(document.createTextNode(item));
        }
    }
}

const inputEventTypes = [
    'input', 'change', 'focus', 'blur', 'select', 'keydown', 'keypress', 'keyup',
    'click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout',
    'mouseenter', 'mouseleave', 'contextmenu'
];
export const InputEvents = {
    input: 'input',
    change: 'change',
    focus: 'focus',
    blur: 'blur',
    select: 'select',
    keydown: 'keydown',
    keypress: 'keypress',
    keyup: 'keyup',
    click: 'click',
    dblclick: 'dblclick',
    mousedown: 'mousedown',
    mouseup: 'mouseup',
    mousemove: 'mousemove',
    mouseover: 'mouseover',
    mouseout: 'mouseout',
    mouseenter: 'mouseenter',
    mouseleave: 'mouseleave',
    contextmenu: 'contextmenu',
}

export const Primitives = {
    //layout
    div: (content = [], attributes = {}) => {
        let result = document.createElement("div");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    main: (content = [], attributes = {}) => {
        let result = document.createElement("main");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    header: (content = [], attributes = {}) => {
        let result = document.createElement("header");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    footer: (content = [], attributes = {}) => {
        let result = document.createElement("footer");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    section: (content = [], attributes = {}) => {
        let result = document.createElement("section");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    //text
    h: (content = [], attributes = {}, level = 6) => {
        let result = document.createElement("h" + Math.max(Math.min(level, 6), 0));
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    h1: (content = [], attributes = {}) => {
        return Primitives.h(content, attributes, 1);
    },
    h2: (content = [], attributes = {}) => {
        return Primitives.h(content, attributes, 2);
    },
    h3: (content = [], attributes = {}) => {
        return Primitives.h(content, attributes, 3);
    },
    h4: (content = [], attributes = {}) => {
        return Primitives.h(content, attributes, 4);
    },
    h5: (content = [], attributes = {}) => {
        return Primitives.h(content, attributes, 5);
    },
    h6: (content = [], attributes = {}) => {
        return Primitives.h(content, attributes, 6);
    },
    p: (content = [], attributes = {}) => {
        let result = document.createElement("p");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    span: (content = [], attributes = {}) => {
        let result = document.createElement("span");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    br: (attributes = {}) => { // br is a self-closing tag
        let result = document.createElement("br");
        applyAttributes(result, attributes);
        return result;
    },
    hr: (attributes = {}) => { // hr is a self-closing tag
        let result = document.createElement("hr");
        applyAttributes(result, attributes);
        return result;
    },
    strong: (content = [], attributes = {}) => {
        let result = document.createElement("strong");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    em: (content = [], attributes = {}) => {
        let result = document.createElement("em");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    //input
    form: (content = [], attributes = {}, messageName = null, messageType = null) => {
        let result = document.createElement("form");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        applyEventListeners(result, messageName, messageType);
        return result;
    },
    textarea: (statevalue, attributes = {}, messageName = null, messageType = null) => {
        let result = document.createElement("textarea");
        applyAttributes(result, attributes);
        if (statevalue !== null) {
            result.value = statevalue;
        }
        return result;
    },
    select: (content = [], attributes = {}, messageName = null, messageType = null) => {
        let result = document.createElement("select");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        applyEventListeners(result, messageName, messageType);
        return result;
    },
    label: (content = [], attributes = {}) => {
        let result = document.createElement("label");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    input: (stateValue, attributes = {}, messageName = null, messageType = null) => {
        let result = document.createElement("input");
        applyAttributes(result, attributes);
        const inputType = attributes.type;
        if (inputType === "checkbox") {
            result.checked = !!stateValue;
        } else if (inputType === "radio") {
            result.checked = (stateValue === attributes.value);
        } else if (stateValue !== null) {
            result.value = stateValue;
        }
        applyEventListeners(result, messageName, messageType);
        return result;
    },
    button: (content = [], attributes = {}, messageName = null, messageType = null) => {
        let result = document.createElement("button");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        applyEventListeners(result, messageName, messageType);
        return result;
    },
    a: (content = [], attributes = {}, messageName = null, messageType = null) => {
        let result = document.createElement("a");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        applyEventListeners(result, messageName, messageType);
        return result;
    },
    menu: (content = [], attributes = {}) => {
        let result = document.createElement("menu");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    option: (content = [], attributes = {}) => {
        let result = document.createElement("option");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    //list
    ul: (content = [], attributes = {}) => {
        let result = document.createElement("ul");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    ol: (content = [], attributes = {}) => {
        let result = document.createElement("ol");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    li: (content = [], attributes = {}) => {
        let result = document.createElement("li");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    //table
    table: (content = [], attributes = {}) => {
        let result = document.createElement("table");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    caption: (content = [], attributes = {}) => {
        let result = document.createElement("caption");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    tbody: (content = [], attributes = {}) => {
        let result = document.createElement("tbody");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    td: (content = [], attributes = {}) => {
        let result = document.createElement("td");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    thead: (content = [], attributes = {}) => {
        let result = document.createElement("thead");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    tr: (content = [], attributes = {}) => {
        let result = document.createElement("tr");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    th: (content = [], attributes = {}) => {
        let result = document.createElement("th");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    tfoot: (content = [], attributes = {}) => {
        let result = document.createElement("tfoot");
        applyAttributes(result, attributes);
        appendChildren(result, content);
        return result;
    },
    img: (attributes = {}) => { // img is a self-closing tag
        let result = document.createElement("img");
        applyAttributes(result, attributes);
        return result;
    },
}

function applyAttributes(element, attributes = {}) {
    for (let key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}
function appendChildren(element, content = []) {
    for (let item of content) {
        if (item instanceof HTMLElement) {
            element.appendChild(item);
        } else if (typeof item === "string" || typeof item === "number") {
            element.appendChild(document.createTextNode(item));
        }
    }
}
function applyEventListeners(element, messageName, messageType) {
    if (messageName && messageType) {
        const resultEvent = (event) => {
            dispatchEvent(new CustomEvent("JELlo", {
                bubbles: true,
                detail: {
                    name: messageName,
                    value: element.value,
                    eventType: event.type,
                    originalEvent: event
                }
            }));
        };
        if (Array.isArray(messageType)) {
            messageType.forEach(eventType => {
                if (inputEventTypes.indexOf(eventType) !== -1) {
                    element.addEventListener(eventType, resultEvent);
                }
            });
        } else if(messageType === "all") {
            inputEventTypes.forEach(eventType => {
                element.addEventListener(eventType, resultEvent);
            });
        } else {
            if (inputEventTypes.indexOf(messageType) !== -1) {
                element.addEventListener(messageType, resultEvent);
            }
        }

    }
}