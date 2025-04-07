const buttonModalTemplate = document.getElementById("button-modal-template").innerHTML;

class ButtonModal{

    constructor(){
        this.dom = $(buttonModalTemplate);
        this.content = this.dom.find(".modal-content");
        this.dom.find(".modal-close").click(()=>{
            this.modalController.hide();
        });
    }

    setModalController(controller){
        this.modalController = controller;
    }

    setButtons(buttons){
        this.content.html("");
        buttons.forEach((button)=>{
            let dom = this._createButton(button);
            dom.click(()=>{
                this.modalController.hide();
            });
            dom.click(button.callback);
            this.content.append(dom);
        });
    }

    _createButton(button){
        let dom = $("<div>").addClass("button").addClass(button.className);
        dom.html($("<img>").attr("src", button.icon));
        return dom;
    }

}

export default ButtonModal;