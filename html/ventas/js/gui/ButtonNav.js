import Navigator from "../app/Navigator.js";

const stateMap = new Map([
    ["operators", Navigator.StateOperator],
    ["places", Navigator.StatePlace],
    ["order",  [Navigator.StateFamily, Navigator.StateProduct, Navigator.StateCombinedProduct]],
    ["ticket", Navigator.StateTicket],
    ["fast-food", Navigator.StateFastFood],
    ["menu", Navigator.StateMenu],
    ["calificators", Navigator.StateCalificator],
    ["menu-selection", Navigator.StateMenuSelection],
    ["client", Navigator.StateClient],
    ["demand", Navigator.StateDemand],
    ["sale-closing", Navigator.StateSaleClosing]
]);

class ButtonNav{
    constructor(){
        this.dom = $("#buttons");
        this.buttonDefMap = new Map();
        this.buttonMap = new Map();
        this.extraButtonMap = new Map();
        this.hiddenButtonMap = new Map();
        this.initButtonDefinitions();
    }

    setNavigator(navigator){
        this.navigator = navigator;
    }

    setControllerMap(map){
        this.controllerMap = map;
    }

    setController(controller){
        this.controller = controller;
    }

    setModalController(controller){
        this.modalController = controller;
    }

    setLoginController(controller){
        this.loginController = controller;
    }

    initButtonDefinitions(){

        let backButton = {
            className: "back-button",
            icon: "./img/dark/back-arrow.png",
            callback: () => {
                this.navigator.goBack();
            }
        }

        let controllerBackButton = {
            className: "back-button",
            icon: "./img/dark/back-arrow.png",
            callback: () => {
                this.controller.goBack();
            }
        }

        let refreshButton = {
            className: "refresh",
            icon: "./img/dark/refresh.png",
            callback: () => {
                this.controller.refresh();
            }
        }

        let ticketButton = {
            className: "ticket-button",
            icon: "./img/dark/ticket.png",
            callback: () => {
                this.navigator.navigateTo({
                    type: Navigator.StateTicket
                });
            }
        }

        let groupButton = {
            className: "group-button",
            icon: "./img/dark/group.png",
            callback: ()=> {
                this.modalController.askGroup((group)=>{
                    this.controller.setGroup(group);
                });
            }
        }

        let worldButton = {
            className: "world-button",
            icon: "./img/dark/world.png",
            callback: ()=> {
               this.controller.worldTouch();
            }
        }

        let calculatorButton = {
            className: "calculator-button",
            icon: "./img/dark/calculator.png",
            callback: ()=> {
                this.controller.askQuantity();
            }
        }

        let fastProductsButton = {
            className: "fast-products-button",
            icon: "./img/dark/fast-products.png",
            callback: ()=> {
                this.controller.toFastProducts();
            }
        }

        let kitchenMessageButton = {
            className: "kitchen-message-button",
            icon: "./img/dark/kitchen-message.png",
            callback: ()=> {
                this.controller.toKitchenMessage();
            }
        }

        let editDinnersButton = {
            className: "pax-button",
            icon: "./img/dark/pax.png",
            callback: ()=> {
                this.controller.editDinners();
            }
        }

        let searchProductButton = {
            className: "product-search-button",
            icon: "./img/dark/search.png",
            callback: () => {
                this.controller.buscarProductos(); // Llama al modal
            }
        };
        

        // let deleteTicketButton = {
        //     className: "delete-ticket-button",
        //     icon: "./img/dark/delete-ticket.png",
        //     callback: ()=> {
        //         this.controller.deleteAll();
        //     }
        // }

        let kitchenButton = {
            className: "kitchen-button",
            icon: "./img/dark/kitchen.png",
            callback: ()=> {
                this.controller.toKitchen();
            }
        }
        
        let moveButton = {
            className: "move-button",
            icon: "./img/dark/move.png",
            callback: ()=> {
                this.controller.moveLines();
            }
        }

        let printButton = {
            className: "print-button",
            icon: "./img/dark/print.png",
            callback: ()=> {
                this.controller.print();
            }
        }

        let closeButton = {
            className: "close-button",
            icon: "./img/dark/coins.png",
            callback: ()=> {
                this.controller.close();
            }
        }

        let costumerButton = {
            className: "costumer-button",
            icon: "./img/dark/client.png",
            callback: ()=> {
                this.controller.assignClient();
            }
        }

        let resendButton = {
            className: "resend-button",
            icon: "./img/dark/resend.png",
            callback: ()=> {
                this.controller.resend();
            }
        }

        let firstHalfButton = {
            className: "first-half-button",
            icon: "./img/dark/first-half.png",
            callback: ()=> {
                this.controller.firstHalf();
            }
        }

        let secondHalfButton = {
            className: "second-half-button",
            icon: "./img/dark/second-half.png",
            callback: ()=> {
                this.controller.secondHalf();
            }
        }

        let fastFoodCalificatorsButton = {
            className: "calificators-button",
            icon: "./img/dark/tag.png",
            callback: ()=> {
                this.controller.askCalificators();
            }
        }

        let sendFastFoodButton = {
            className: "send-button",
            icon: "./img/dark/tick.png",
            callback: ()=> {
                this.controller.sendTouch();
            }
        }

        let nextMenuButton = {
            className: "next-menu-button",
            icon: "./img/dark/plus.png",
            callback: ()=> {
                this.controller.nextMenu();
            }
        }

        let sendMenuButton = {
            className: "send-button",
            icon: "./img/dark/tick.png",
            callback: ()=> {
                this.controller.sendTouch();
            }
        }

        let newCalificatorButton = {
            className: "new-button",
            icon: "./img/dark/plus.png",
            callback: ()=> {
                this.controller.newCalificator();
            }
        }

        let sendCalificatorButton = {
            className: "send-button",
            icon: "./img/dark/tick.png",
            callback: ()=> {
                this.controller.send();
            }
        }

        let newMenuSelectionButton = {
            className: "new-button",
            icon: "./img/dark/plus.png",
            callback: ()=> {
                this.controller.newTouch();
            }
        }

        let searchClientButton = {
            className: "search-button",
            icon: "./img/dark/search.png",
            callback: ()=> {
                this.controller.searchTouch();
            }
        }

        let tariffButton = {
            className: "tariff-button",
            icon: "./img/dark/tariff.png",
            callback: ()=> {
                this.controller.askTariff();
            }
        }

        let sendButton = {
            className: "send-button",
            icon: "./img/dark/tick.png",
            callback: ()=> {
                this.controller.send();
            }
        }

        let selectAllButton = {
            className: "select-all-button",
            icon: "./img/dark/select-all.png",
            callback: ()=> {
                this.controller.selectAll();
            }
        }

        let twoPaymentsButton = {
            className: "two-payments-button",
            icon: "./img/dark/two-payment-ways.png",
            callback: ()=> {
                this.controller.togglePayments();
            }
        }

        let linesButton = {
            className: "lines-button",
            icon: "./img/dark/partial.png",
            callback: ()=> {
                this.controller.linesTouch();
            }
        }

        let divideDinnersButton = {
            className: "divide-dinners-button",
            icon: "./img/dark/dinners.png",
            callback: ()=> {
                this.controller.divideDinners();
            }
        }

        let hotelButton = {
            className: "hotel-button",
            icon: "./img/dark/hotel.png",
            callback: ()=> {
                this.controller.hotel();
            }
        }

        let resetPriceButton = {
            className: "reset-price-button",
            icon: "./img/dark/refresh.png",
            callback: ()=> {
                this.controller.resetPrices();
            }
        }

        this.popupButton = {
            className: "popup-button",
            icon: "./img/dark/popup.png",
            callback: ()=>{
                this.showExtraButtons();
            }
        };
        
        this.buttons = [
            this.popupButton,
            controllerBackButton,
            backButton,
            refreshButton,
            ticketButton,
            groupButton,
            worldButton,
            calculatorButton,
            editDinnersButton,
            fastProductsButton,
            kitchenMessageButton,
            tariffButton,
            //deleteTicketButton,
            kitchenButton,
            moveButton,
            printButton,
            closeButton,
            costumerButton,
            resendButton,
            newCalificatorButton,
            sendCalificatorButton,
            firstHalfButton,
            secondHalfButton,
            fastFoodCalificatorsButton,
            sendFastFoodButton,
            nextMenuButton,
            sendMenuButton,
            newMenuSelectionButton,
            searchClientButton,
            sendButton,
            selectAllButton,
            twoPaymentsButton,
            linesButton,
            divideDinnersButton,
            hotelButton,
            resetPriceButton
        ];
        
        this.buttonDefMap.set(Navigator.StateOperator, [
            refreshButton
        ]);

        this.buttonDefMap.set(Navigator.StatePlace, [
            controllerBackButton
        ]);

        let orderButtonsDef = [
            controllerBackButton,
            ticketButton,
            groupButton,
            worldButton,
            calculatorButton,
            fastProductsButton,
            kitchenMessageButton,
            searchProductButton, // 👈 Asegurate de incluirlo
            tariffButton,
            editDinnersButton
        ];

        this.buttonDefMap.set(Navigator.StateFamily, orderButtonsDef);
        this.buttonDefMap.set(Navigator.StateProduct, orderButtonsDef);
        this.buttonDefMap.set(Navigator.StateCombinedProduct, orderButtonsDef);

        this.buttonDefMap.set(Navigator.StateTicket, [
            backButton,
            //deleteTicketButton,
            kitchenButton,
            moveButton,
            printButton,
            closeButton,
            costumerButton,
            resendButton,
            hotelButton,
            //resetPriceButton
            worldButton
        ]);

        this.buttonDefMap.set(Navigator.StateCalificator, [
            controllerBackButton,
            newCalificatorButton,
            sendCalificatorButton
        ]);
        this.buttonDefMap.set(Navigator.StateFastFood, [
            controllerBackButton,
            firstHalfButton,
            secondHalfButton,
            fastFoodCalificatorsButton,
            sendFastFoodButton
        ]);

        this.buttonDefMap.set(Navigator.StateMenu, [
            controllerBackButton,
            nextMenuButton,
            sendMenuButton
        ]);

        this.buttonDefMap.set(Navigator.StateMenuSelection, [
            backButton,
            newMenuSelectionButton,
            calculatorButton
        ]);

        this.buttonDefMap.set(Navigator.StateClient, [
            backButton,
            searchClientButton
        ]);

        this.buttonDefMap.set(Navigator.StateDemand, [
            backButton,
            selectAllButton,
            sendButton
        ]);

        this.buttonDefMap.set(Navigator.StateSaleClosing, [
            controllerBackButton,
            twoPaymentsButton,
            linesButton,
            divideDinnersButton,
            sendButton
        ]);

        for(let button of this.buttons){
            button.visible = true;
            button.dom = this._createButton(button);
        }
    }

    changeState(state){
        this.state = state;
        this.controller = this.controllerMap.get(state);
        this.showButtons([]);
    }

    showButtons(hiddenButtons){
        this.dom.children().detach();
        let buttons = this.buttonDefMap.get(this.state).filter((button)=>button.visible);
        buttons = buttons.filter((button)=>{
            return hiddenButtons.indexOf(button.className) === -1;
        });
        if(!buttons){
            return;
        }
        let count = buttons.length;
        if(count==0){
            return;
        }
        for(let i=0; i<Math.min(count, 5); i++){
            let button = buttons[i];
            this.dom.append(button.dom);
        }
        if(count==6){
            let button = buttons[5];
            this.dom.append(button.dom);
        } else if(count>6){
            this.dom.append(this.popupButton.dom);
        }
    }

    setHideButtons(hideButtons){
        for (const key of Object.keys(hideButtons)) {
            let states = stateMap.get(key);
            if(!states){
                continue;
            }
            if(!Array.isArray(states)){
                states = [states];
            }
            let hiddenButtons = hideButtons[key];
            for(let state of states){
                let buttonDefs = this.buttonDefMap.get(state);
                if(!buttonDefs){
                    continue;
                }
                for(let buttonDef of buttonDefs){
                    let className = buttonDef.className;
                    if(hiddenButtons.includes(className)){
                        buttonDef.visible = false;
                    }
                }
            }
        }
    }

    hideButton(state, className){  
        let buttons = this.buttonDefMap.get(state);
        for(let button of buttons){
            if(button.className == className){
                button.visible = false;
                break;
            }
        }
    }

    showExtraButtons(){
        let buttons = this.buttonDefMap.get(this.state).filter((button)=>button.visible);
        this.modalController.showButtons(buttons.slice(5));
    }

    _createButton(buttonDef){
        let button = $("<div>").addClass("button").addClass(buttonDef.className);
        button.click(buttonDef.callback);
        button.html($("<img>").attr("src", buttonDef.icon));
        return button;
    }
}

export default ButtonNav;