import HTMLUtil from "lib/util/HTMLUtil.js"; 

const calificatorView = HTMLUtil.createElementFromTemplateId("calificator-view-template");

class CalificatorView{
    constructor(calificator){
        this.calificator = calificator;
        this.dom = calificatorView.cloneNode(true);
        this.description = this.dom.querySelector(".calificator-description");
        this.description.appendChild(document.createTextNode(calificator.description));
        this.dom.addEventListener("click", ()=>{
            this.controller.calificatorTouch(calificator);
        });
    }

    setController(controller){
        this.controller = controller;
    }

    select(){
        this.dom.classList.add("selected");
    }

    unselect(){
        this.dom.classList.remove("selected");
    }
}

export default CalificatorView;