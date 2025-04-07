const selectModalTemplate = document.getElementById("select-modal-template").innerHTML;

class SelectModal{

    constructor(){
        this.dom = $(selectModalTemplate);
        this.header = this.dom.find(".modal-header");
        this.content = this.dom.find(".modal-content");
        this.callback = null;
        this.views = new Map();
        this.closeButton = this.dom.find(".modal-close");
        this.closeButton.click(()=>{
            this.modalController.hide();
        });
    }

    setModalController(controller){
        this.modalController = controller;
    }

    setTitle(title){
        this.header.text(title);
    }

    setOptions(options){
        this.options = options;
        this.content.html("");
        for(let option of options){
            let optionView = $("<div>").text(option.description);
            optionView.click(()=>{
                this.modalController.hide();
                this.callback(option.id);
            });
            this.views.set(option.id, optionView)
            this.content.append(optionView);
        }
    }

    select(optionId){
        let view = this.views.get(optionId);
        if(!view){
            return;
        }
        view.addClass("selected");
    }

    setCallback(callback){
        this.callback = callback;
    }

    show(){
        this.modalController.switchTo(this.dom);
    }
}

export default SelectModal;