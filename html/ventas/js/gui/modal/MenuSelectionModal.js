import Constants from "../../app/Constants.js";

const ticketLineModalTemplate = document.getElementById("ticket-line-modal-template").innerHTML;

class MenuSelectionModal{
    constructor(){

        this.dom = $(ticketLineModalTemplate);
        this.buttons = this.dom.find(".ticket-line-modal-buttons");
        
        this.closeButton = this.dom.find(".modal-close");
        
        this.lineView = this.dom.find(".ticket-line-modal-line");
        this.deleteButton = this.dom.find(".ticket-line-delete-button");
        this.moveButton = this.dom.find(".ticket-line-move-button");
        this.priceButton = this.dom.find(".ticket-line-price-button");
        this.quantityButton = this.dom.find(".ticket-line-quantity-button");
        this.unitPriceButton = this.dom.find(".ticket-line-unit-button");
        this.treatButton = this.dom.find(".ticket-line-treat-button");
        this.untreatButton = this.dom.find(".ticket-line-untreat-button");
        this.calificatorButton = this.dom.find(".ticket-line-calificator-button");
        this.discountButton = this.dom.find(".ticket-line-discount-button");
        this.groupButton = this.dom.find(".ticket-line-group-button");
        this.editMenuButton = this.dom.find(".ticket-line-menu-button");
        this.editFastFoodButton = this.dom.find(".ticket-line-fast-food-button");
        this.demandLineButton = this.dom.find(".ticket-line-demand-button");
        this.askNextButton = this.dom.find(".ticket-line-ask-next-button");

        this.lineView.remove();
        this.moveButton.remove();
        this.priceButton.remove();
        this.unitPriceButton.remove();
        this.treatButton.remove();
        this.untreatButton.remove();
        this.discountButton.remove();
        this.editMenuButton.remove();
        this.demandLineButton.remove();
        this.askNextButton.remove();

        this.closeButton.click(()=>{
            this.modalController.hide();
        });

        this.deleteButton.click(()=>{
            this.modalController.hide();
            this.menuSelectionController.deleteLine(this.line);
        });

        this.quantityButton.click(()=>{
            this.modalController.hide();
            this.menuSelectionController.updateQuantity(this.line);
        });

        this.calificatorButton.click(()=>{
            this.modalController.hide();
            this.menuSelectionController.askCalificators(this.line);
        });

        this.groupButton.click(()=>{
            this.modalController.hide();
            this.menuSelectionController.updateGroup(this.line);
        });

        this.editFastFoodButton.click(()=>{
            this.modalController.hide();
            this.menuSelectionController.editFastFood(this.line);
        });
    }

    setModalController(controller){
        this.modalController = controller;
    }

    setMenuSelectionController(controller){
        this.menuSelectionController = controller;
    }

    setLine(line){
        this.line = line;
        this.buttons.children().removeClass("hidden");
        if(line.product.type == Constants.TYPE_FAST_FOOD){
            this.editFastFoodButton.removeClass("hidden");
        } else{
            this.editFastFoodButton.addClass("hidden");
        }
        if(line.product.type == Constants.TYPE_FAST_FOOD){
            this.quantityButton.addClass("hidden");
        } else{
            this.quantityButton.removeClass("hidden");
        }         
    }


}

export default MenuSelectionModal;