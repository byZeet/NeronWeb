import OperatorView from "./OperatorView.js";

const operatorPanelTemplate = document.getElementById("operator-panel-template").innerHTML;

class OperatorPanel{

    constructor(){
        this.dom = $(operatorPanelTemplate);
        this.views = new Map();
    } 

    setController(controller){
        this.controller = controller;
    }

    addOperators(operators){
        for(let operator of operators.values()){
            let view = this.views.get(operator.id);
            if(!view){  
                view = new OperatorView(this.controller, operator);
                this.dom.append(view.dom);
                this.views.set(operator.id, view);
            }
            if(operator.active){
                view.show();
            } else{
                view.hide();
            }
        }
    }
}

export default OperatorPanel;