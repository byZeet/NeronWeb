import DemandLineView from "./DemandLineView.js";

const demandPanelTemplate = document.getElementById("demand-panel-template").innerHTML;

class DemandPanel{

    constructor(){
        this.dom = $(demandPanelTemplate);
        this.views = new Map();
        this.content = this.dom.find(".demand-lines");
    }

    setController(controller){
        this.controller = controller;
    }

    refresh(){
        this.content.html("");
    }

    setLines(){
        this.views.clear();
        for(let line of lines){
            this.addLine(line);
        }
    }

    addLine(selection){
        let demandLineView = new DemandLineView(this.controller, selection);
        this.views.set(selection.line.id, demandLineView);
        this.content.append(demandLineView.dom);
    }

    getLineView(id){
        return this.views.get(id);
    }
}

export default DemandPanel;