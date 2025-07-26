import {
    JELloEvents,
    JELloElement,
    Primitives,
    InputEvents,
    applyAttributes,
    applyEventListeners
} from "../../JELlo.mjs";
export class Slider extends JELloElement {
    constructor() {
        super();
        this.min = 0;
        this.max = 10;
        this.step = 1;
        this.value = 5;
        this.mousedown = false;
        this.mousepos = 0;
        this.initvalue = 0;
    }
    connectedCallback() {
        this.getAttributeNames().forEach(name => {
            const value = this.getAttribute(name);
            this.processAttributes(name, value);
        })
        super.connectedCallback(this.update.bind(this), this.view.bind(this));
        this.addEventListener("mouseleave", (event) => {
            dispatchEvent(new CustomEvent('JELlo', {detail: {name: "mouseLeave", eventType: InputEvents.mouseleave}}));
        })
        this.addEventListener("mouseup", (event) => {
            dispatchEvent(new CustomEvent('JELlo', {detail: {name: "mouseUp", eventType: InputEvents.mouseup, originalEvent: event}}));
        })
        this.addEventListener("mousemove", (event) => {
            dispatchEvent(new CustomEvent('JELlo', {detail: {name: "mouseMove", eventType: InputEvents.mousemove, originalEvent: event}}));
        })
    }
    static observedAttributes = ["value", "min", "max", "step"];
    attributeChangedCallback(name, value) {
        this.processAttributes(name, value);
    }
    new(stateValue, attributes = {}, messageName = null, messageType = null) {
        let result = document.createElement("jello-slider");
        applyAttributes(result, attributes);
        applyEventListeners(result, messageName, messageType);
        result.value = stateValue;
        return result;
    }
    processAttributes(name, value) {
        switch (name) {
            case "min": {
                const nval = Number(value);
                if (!isNaN(nval)) {
                    this.min = nval;
                }
                break;
            }
            case "max": {
                const nval = Number(value);
                if (!isNaN(nval)) {
                    this.max = nval;
                }
                break;
            }
            case "step": {
                const nval = Number(value);
                if (!isNaN(nval)) {
                    this.step = nval;
                }
                break;
            }
            case "value": {
                const nval = Number(value);
                if (!isNaN(nval)) {
                    this.value = nval;
                }
                break;
            }
        }
    }
    update(message) {
        let returnValue = null;
        switch(message.name) {
            case "thumb": {
                switch (message.eventType) {
                    case InputEvents.mousedown: {
                        this.mousepos = message.originalEvent.clientX;
                        this.initvalue = this.value;
                        this.mousedown = true;
                        break;
                    }
                }
                break;
            }
            case "mouseLeave":
            case "mouseUp": {
                if (this.mousedown) {
                    this.mousedown = false;
                    this.value = Math.round((Math.round(this.value/this.step) * this.step) * 1000000) / 1000000;
                    console.log(this.value);
                    returnValue =  {name: JELloEvents.reRender}
                }
                break;
            }
            case "mouseMove": {
                if (this.mousedown) {
                    const sliderWidth = this.offsetWidth;
                    const xoffset = message.originalEvent.clientX - this.mousepos;
                    this.value = Math.max(Math.min(this.initvalue + ((xoffset / sliderWidth) * (this.max - this.min)), this.max), this.min);
                    returnValue =  {name: JELloEvents.reRender}
                }
                break;
            }
            default: {}
        }
        if (returnValue) {
            return returnValue;
        }
    }
    view() {
        return [
            Primitives.div([
                Primitives.div([
                    Primitives.button([],{
                        style: "width: 15pt; height: 15pt; position: absolute; left: calc("
                            + Math.round(100*((this.value - this.min)/(this.max - this.min)))
                            +"% - 7.5pt); top: -5pt; border-radius: 7.5pt; border: none; background-color: blue; display: block;"
                    },"thumb",[InputEvents.mousedown])
                ], {
                    style: "position: absolute; top: calc(50% - 2.5pt); left: 0; right: 0; border-radius: 2.5pt; background-color: white; height: 5pt;",
                })
            ],{
                style: "position: relative; width: 100%; height: 100%;",
            })
        ]
    }
}
customElements.define('jello-slider', Slider);