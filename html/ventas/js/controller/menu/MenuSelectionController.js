import Navigator from "../../app/Navigator.js";

class MenuSelectionController{

    setView(view){
        this.view = view;
    }

    setNavigator(navigator){
        this.navigator = navigator;
    }

    setModalController(controller){
        this.modalController = controller;
    }

    setMenuSelectionModal(modal){
        this.menuSelectionModal = modal;
    }

    setMenuController(controller){
        this.menuController = controller;
    }

    setGroupSelections(selections){
        this.groupSelections = selections;
    }

    setSendCallback(callback){
        this.sendCallback = callback;
    }

    setSelection(group, selection){
        this.group = group;
        this.selection = selection;
        this.product = selection.product;
        this.view.setSelection(group, selection.quantity, this.product);
        this.refresh();
    }

    refresh(){
        if(this.selection){
            this.view.setSelection(this.group, this.selection.quantity, this.product);
            this.view.setLines(this.selection.lines);
        }
    }

    deleteLine(line){
        this.menuController.deleteLine(line);
        this.refresh();
    }

    updateQuantity(line){
        this.modalController.askIntegerInput("Introduciendo cantidad", "Cantidad:", "", (quantity) => {
            this.menuController.updateLineQuantity(line, quantity);
            this.refresh();
        });
    }

    updateGroup(line){
        this.modalController.askGroup((group)=>{
            if(group==line.group){
                return;
            }
            this.menuController.updateLineGroup(line, group);
            this.refresh();
        });
    }

    askCalificators(line){
        this.navigator.navigateTo({
            type: Navigator.StateCalificator,
            calificators: line.calificators,
            obligatory: line.product.hasObligatoryCalificator(),
            defaultGroup: line.product.getDefaultGroup(),
            sendCallback: (calificators)=>{
                this.menuController.updateLineCalificators(line, calificators);
                this.refresh();
            }
        });
    }

    editFastFood(line){
        let startingSelections = [];
        for(let fastFoodSelection of line.fastFoodSelections){
            let ingredient = fastFoodSelection.ingredient;
            let part = fastFoodSelection.part;
            let product = ingredient.product;
            let type = ingredient.type;
            startingSelections.push({
                part: part,
                type: type,
                ingredient: ingredient,
                id: product.id,
                price: ingredient.price,
                quantity: fastFoodSelection.quantity
            });
        }
        this.navigator.navigateTo({
            type: Navigator.StateFastFood,
            product: line.product,
            quantity: 1,
            selections: startingSelections,
            calificators: line.calificators,
            sendCallback: (items)=>{
                line.edit = true;
                line.fastFoodSelections = items[0].selections;
                line.calificators = items[0].calificators;
                this.menuController.changed = true;
                this.refresh();
            }
        });
    }

    //GUI Events
    lineTouch(line){
        this.menuSelectionModal.setMenuSelectionController(this);
        this.menuSelectionModal.setLine(line);
        this.menuSelectionModal.setModalController(this.modalController);
        this.modalController.switchTo(this.menuSelectionModal.dom);
    }

    newTouch(){
        this.menuController.pt_setQuantity(this.product, this.group.id, 1);
        this.refresh();
    }

    askQuantity(){
        this.modalController.askIntegerInput("Introduciendo cantidad", "Cantidad:", "", (quantity) => {
            this.menuController.pt_setQuantity(this.product, this.group.id, quantity);
            this.refresh();
        });
    }

}

export default MenuSelectionController;