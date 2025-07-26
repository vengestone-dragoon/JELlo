import {JELloElement,JELloEvents} from "../../JELlo/JELlo.mjs";

export class FormExample extends JELloElement{
    constructor() {
        super();
    }
    connectedCallback() {
        super.connectedCallback(this.update.bind(this),this.view.bind(this));
    }
    update() {

    }
    view() {

    }
}

customElements.define("form-example", FormExample);