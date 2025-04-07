import Constants from "../../app/Constants.js";

const ticketLineModalTemplate = document.getElementById("ticket-line-modal-template").innerHTML;

class TicketLineModal{

    constructor(){
        this.dom = $(ticketLineModalTemplate);

        this.line = null;
        this.ticketController = null;
        this.modalController = null;

        this.closeButton = this.dom.find(".modal-close");

        this.buttons = this.dom.find(".ticket-line-modal-buttons");

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
        this.askNextButton = this.dom.find(".ticket-line-ask-next-button");
        this.demandLineButton = this.dom.find(".ticket-line-demand-button");
        this.deleteAllButton = this.dom.find(".ticket-line-delete-all-button");

        this.layout = new Map()
        this.layout.set("delete", {
            button: this.deleteButton,
            callback: ()=>{
                this.modalController.hide();
                this.ticketController.deleteLine(this.line);
            },
            position: [1, 1]
        });
        this.layout.set("price", {
            button: this.priceButton,
            callback: ()=>{
                this.ticketController.updatePrice(this.line);
            },
            position: [1, 2]
        });
        this.layout.set("unit-price", {
            button: this.unitPriceButton,
            callback: ()=>{
                this.ticketController.updateUnitPrice(this.line);
            },
            position: [2, 1]
        });
        this.layout.set("quantity", {
            button: this.quantityButton,
            callback: ()=>{
                this.ticketController.updateQuantity(this.line);
            },
            position: [2, 2]
        });
        this.layout.set("calificators", {
            button: this.calificatorButton,
            callback: ()=>{
                this.modalController.hide();
                this.ticketController.calificators(this.line);
            },
            position: [3, 1]
        });
        this.layout.set("group", {
            button: this.groupButton,
            callback: ()=>{
                this.modalController.askGroup((group)=>{
                    this.ticketController.updateGroup(this.line, group);
                });
            },
            position: [3, 2]
        });
        this.layout.set("treat", {
            button: this.treatButton,
            states: {
                treat: {
                    text: "Invitar",
                    callback: ()=>{
                        this.modalController.hide();
                        this.ticketController.treatLine(this.line);
                    }
                },
                untreat: {
                    text: "Desinvitar",
                    callback: ()=>{
                        this.modalController.hide();
                        this.ticketController.treatLine(this.line);
                    }
                }
            },
            position: [4, 1]
        });

        this.layout.set("edit-menu", {
            button: this.editMenuButton,
            callback: ()=>{
                this.modalController.hide();
                this.ticketController.editMenu(this.line);
            },
            position: [4, 2]
        });

        this.layout.set("edit-fast-food", {
            button: this.editFastFoodButton,
            callback: ()=>{
                this.modalController.hide();
                this.ticketController.editFastFood(this.line);
            },
            position: [5, 1]
        });

        this.layout.set("delete-all", {
            button: this.deleteAllButton,
            callback: ()=>{
                this.modalController.hide();
                this.ticketController.deleteAll();
            },
            position: [5, 2]
        });

        this.layout.set("demand-line", {
            button: this.demandLineButton,
            callback: ()=>{
                this.modalController.hide();
                this.ticketController.demandLine(this.line);
            },
            position: [6, 1]
        });

        this.layout.set("ask-next", {
            button: this.askNextButton,
            callback: ()=>{
                this.modalController.hide();
                this.ticketController.askNextDishes(this.line);
            },
            position: [6, 2]
        });

        this.layout.set("discount", {
            button: this.discountButton,
            callback: ()=>{
                this.modalController.hide();
                this.ticketController.discount(this.line);
            },
            position: [7, 1]
        });

        /*this.layout.set("move", {
            button: this.moveButton,
            callback: ()=>{
                this.modalController.hide();
                this.ticketController.moveLines();
            },
            position: [7, 2]
        });*/

        for(let config of this.layout.values()){
            let button = config.button;
            button.css({
                gridRow: config.position[0] + "/ span 1",
                gridColumn: config.position[1] + "/ span 1"
            });
        }
        
        this.closeButton.click(()=>{
            this.modalController.hide();
        });

        this.enable("delete");
        this.enable("delete-all")
        this.enable("price"),
        this.enable("unit-price");
        //this.enable("move");
    }

    setTicketController(controller){
        this.ticketController = controller;
    }

    setModalController(controller){
        this.modalController = controller;
    }

    enable(name){
        let o = this.layout.get(name);
        let button = o.button;
        button.off();
        button.removeClass("disabled");
        button.on("click", o.callback);
    }

    disable(name){
        let o = this.layout.get(name);
        let button = o.button;
        button.addClass("disabled");
        button.off();
    }

    setEnabled(name, flag){
        if(flag){
            this.enable(name);
        } else{
            this.disable(name);
        }
    }

    toggle(name, stateName){
        let o = this.layout.get(name);
        let state = o.states[stateName];
        o.button.off();
        o.button.on("click", state.callback);
        o.button.text(state.text);
    }

    setLine(line){
        this.buttons.children().removeClass("disabled");
        this.line = line;
        this.lineView.text(line.showDescription);
        this.toggle("treat", line.free?"untreat":"treat");
        if(line.isMenu()
            || line.isMenuComponent()
            || (line.superline != null && line.superline.isMenuComponent())){
            this.enable("edit-menu");
        } else{
            this.disable("edit-menu");
        }
        let groupable = !line.isMenu() && !line.isFastFoodIngredient();
        this.setEnabled("group", groupable);
        this.setEnabled("calificators", groupable);
        this.setEnabled("edit-fast-food", line.isFastFood() || line.isFastFoodIngredient());
        this.setEnabled("quantity", !line.isMenuComponent());
        this.setEnabled("discount", !(line.free||line.discount));
        let isStandalone = !line.isFastFoodIngredient();
        let demandable = line.kitchen && isStandalone;
        this.setEnabled("ask-next", demandable);
        this.setEnabled("demand-line", demandable);
    }
}

export default TicketLineModal;