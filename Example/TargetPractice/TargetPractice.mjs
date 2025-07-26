import {JELloElement,Primitives,InputEvents,JELloEvents} from "../../JELlo/JELlo.mjs";
export class TargetPractice extends JELloElement {
    constructor() {
        super();
        this.count=0;
        this.target = {
            x: 50,
            y: 50,
        };
        this.clickAverage = null;
        this.clickDifferenceList = [];
        this.lastClick = null;
    }
    connectedCallback() {
        super.connectedCallback(this.update.bind(this), this.view.bind(this));
    }
    update(message) {
        const name = message.name;
        switch (name) {
            case "button1Clicked": {
                this.count++;
                if (this.lastClick) {
                    const thisClick = Date.now();
                    this.clickDifferenceList.push(thisClick - this.lastClick);
                    this.lastClick = thisClick;
                    let clickTimeTotal = 0;
                    for (let i = 0; i < this.clickDifferenceList.length; i++) {
                        clickTimeTotal = clickTimeTotal + this.clickDifferenceList[i];
                    }
                    this.clickAverage = Math.round(clickTimeTotal / this.clickDifferenceList.length);
                } else {
                    this.lastClick = Date.now();
                }
                this.target.x = Math.max(Math.min(Math.round((Math.random()%100)*100),90),10);
                this.target.y = Math.max(Math.min(Math.round((Math.random()%100)*100),90),10);
                break;
            }
        }
        return {name: JELloEvents.reRender}
    }
    view() {
        return [
            Primitives.div([
                Primitives.h1(["Target Practice"], {class: "title"}),
                Primitives.span([
                    "Times clicked: ",
                    this.count,
                ], {
                    class: "clickCount"
                }),
                Primitives.span([
                    "Click Speed Average: ",
                    this.clickAverage,
                ], {
                    class: "clickAverage"
                }),
                Primitives.button([],{
                    class: "target",
                    style: "top: calc("
                        + this.target.y
                        + "% - 16pt); left: calc("
                        + this.target.x
                        + "% - 16pt);"
                },"button1Clicked",InputEvents.click),
                Primitives.span([
                    Primitives.strong(["PosX: "]),
                    this.target.x,
                    " , ",
                    Primitives.strong(["PosY: "]),
                    this.target.y
                ], {
                    class: "posReport"
                })
            ],{
                class: "view",
            })
        ];
    }
}
customElements.define('target-practice', TargetPractice);