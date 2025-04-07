import Constants from "../app/Constants.js";

class DemandController{

    constructor(){
        this.lineMap = new Map();
    }

    setView(view){
        this.view = view;
    }

    setModalController(controller){
        this.modalController = controller;
    }

    setNavigator(navigator){
        this.navigator = navigator;
    }

    setEmptyAllowed(emptyAllowed){
        this.emptyAllowed = emptyAllowed;
    }

    setLines(lines){
        this.lineMap.clear();
        this.view.refresh();
        for(let line of lines.values()){
            this.addLine(line);
        }
    }

    addLine(demandLine){
        this.lineMap.set(demandLine.line.id, demandLine);
        this.view.addLine(demandLine);
    }

    setSendCallback(callback){
        this.sendCallback = callback;
    }

    setCheckErrorCallback(callback){
        this.checkErrorCallback = callback;
    }

    send(){
        let selections = Array.from(this.lineMap.values());
        selections = selections.filter((selection) => {
            return selection.selectedQuantity>0;
        });
        if(!this.emptyAllowed && selections.length==0){
            this.modalController.alert(
                "Selección vacía", 
                "No se ha seleccionado ningún plato."
            );
            return;
        }
        if(this.checkErrorCallback){
            if(!this.checkErrorCallback(selections)){
                return;
            }
        }
        this.navigator.goBack();
        this.sendCallback(selections);
    }


    selectAll(){
        for(let selection of this.lineMap.values()){
            this.setQuantity(selection.line, selection.quantity);
        }
    }

    setQuantity(line, quantity){
        let selection = this.lineMap.get(line.id);
        selection.selectedQuantity = quantity;
        this.view.getLineView(line.id).setSelectedQuantity(quantity);
    }

    lineTouch(line){
        let selection = this.lineMap.get(line.id);
        if(selection.quantity == 1 || !selection.divisible || !Number.isInteger(selection.quantity)){
            if(selection.selectedQuantity == 0){
                this.setQuantity(line, selection.quantity);
            } else{
                this.setQuantity(line, 0);
            }
        } else{
            this.modalController.askIntegerInput(
                "Introduciendo cantidad", 
                "Cantidad:", 
                "", 
                (quantity) => {
                    if(quantity>selection.quantity){
                        quantity = selection.quantity;
                    }
                    this.setQuantity(line, quantity);
                }
            );
        }
    }
}

export default DemandController;