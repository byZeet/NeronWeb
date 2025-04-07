const operatorViewTemplate = $(document.getElementById("operator-view-template").innerHTML);

class OperatorView{

    constructor(controller, operator){
        this.controller = controller;
        this.dom = operatorViewTemplate.clone();
        this.dom.find(".operator-name").text(operator.name);
        this.dom.find(".operator-image").attr("src", "./img/dark/user.png");
        this.dom.click(()=>{
            this.controller.operatorTouch(operator);
            
        });
    } 

    hide(){
        this.dom.addClass("hidden");
    }

    show(){
        this.dom.removeClass("hidden");
    }
}

export default OperatorView;