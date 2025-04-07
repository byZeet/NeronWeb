class Navigator{

    constructor(){
        this.stateHistory = [];
        this.state = null;
    }

    setControllerMap(map){
        this.controllerMap = map;
    }

    setRootPanel(rootPanel){
        this.rootPanel = rootPanel;
    }

    setButtonNav(buttonNav){
        this.buttonNav = buttonNav;
    }

    newState(state) {
        if(this.state!=null){
            this.stateHistory.push(this.state);
        }
        this.state = state;
    }

    navigateTo(state){
        this.newState(state);
        this.switchTo(state, false);
    }

    unwindUntil(check){
        let state;
        let flag;
        do{
            state = this.stateHistory.pop();
            flag = !check(state);
        } while(flag);
        this.state = state;
        this.switchTo(state, true);
    }

    goBack(){
        let prevState = this.stateHistory.pop();
        this.state = prevState;
        this.switchTo(prevState, true);
    }

    hideButtons(hiddenButtons){
        this.buttonNav.showButtons(hiddenButtons);
    }

    switchTo(state, backward){
        this.buttonNav.changeState(state.type);
        if(state.controller){
            this.controller = state.controller;
        } else{
            this.controller = this.controllerMap.get(state.type);
        }
        this.rootPanel.switchState(state, this.controller);
        switch(state.type){
            case Navigator.StateOperator:
                if(!backward){
                    this.toOperatorState(state);
                }
                break;
            case Navigator.StatePlace:
                this.toPlaceState(state);
                break;
            case Navigator.StateFamily:
                this.toFamilyState(state);
                break;
            case Navigator.StateProduct:
                this.toProductState(state);
                break;
            case Navigator.StateCombinedProduct:
                this.toCombinedProductState(state);
                break;
            case Navigator.StateTicket:
                if(!backward){
                    this.toTicketState(state);
                }
                break;
            case Navigator.StateFastFood:
                if(!backward){
                    this.toFastFoodState(state);
                }
                break;
            case Navigator.StateMenu:
                if(!backward){
                    this.toMenuState(state);
                }
                break;
            case Navigator.StateCalificator:
                if(!backward){
                    this.toCalificatorState(state);
                }
                break;
            case Navigator.StateMenuSelection:
                if(!backward){
                    this.toMenuSelectionState(state);
                }
                break;
            case Navigator.StateClient:
                if(!backward){
                    this.toClientState(state);
                }
                break;
            case Navigator.StateDemand:
                if(!backward){
                    this.toDemandState(state);
                }
                break;
            case Navigator.StateSaleClosing:
                this.toSaleClosingState(state, backward);
                break;
        }
    }

    toOperatorState(state){
        let operators = state.operators;
        this.controller.setOperatorMap(operators);
    }

    toPlaceState(state){
        let title = state.title;
        let backCallback = state.backCallback;
        let unblockCallback = state.unblockCallback;
        let tableCallback = state.tableCallback;
        this.rootPanel.setTitle(title);
        this.controller.init();
        this.controller.refresh();
        this.controller.setTableCallback(tableCallback);
        this.controller.setUnblockCallback(unblockCallback);
        this.controller.setBackCallback(backCallback);
    }

    toFamilyState(state){
        let families = state.families;
        this.controller.setFastProductsFlag(false);
        this.controller.showFamilies(families);
    }

    toProductState(state){
        let products = state.products;
        if(state.fastProducts){
            this.controller.setFastProductsFlag(true);
        } else{
            this.controller.setFastProductsFlag(false);
        }
        this.controller.showProducts(products);
    }

    toCombinedProductState(state){  
        let products = state.products;
        this.controller.setFastProductsFlag(false);
        this.controller.showCombinedProducts(products);
    }

    toTicketState(state){

    }

    toFastFoodState(state){
        let product = state.product;
        let quantity = state.quantity;
        let selections = state.selections;
        let calificators = state.calificators;
        let sendCallback = state.sendCallback;
        if(calificators){
            this.controller.setCalificators(calificators);
        } else{
            this.controller.setCalificators([]);
        }
        this.controller.setFastFood(product);
        this.controller.setQuantity(quantity);
        this.controller.setSendCallback(sendCallback);
        if(selections){
            this.controller.setStartingSelections(selections);
        }
    }

    toMenuState(state){
        let product = state.product;
        let quantity = state.quantity;
        let selections = state.selections;
        let sendCallback = state.sendCallback;
        let hiddenButtons = state.hiddenButtons;
        this.controller.setQuantity(quantity);
        this.controller.setMenu(product);
        this.controller.setSendCallback(sendCallback);
        if(selections){
            this.controller.setStartingSelections(selections);
        }
        if(hiddenButtons){
            this.hideButtons(hiddenButtons);
        }
    }

    toCalificatorState(state){
        let calificators = state.calificators;
        let obligatory = state.obligatory;
        let defaultGroup = state.defaultGroup;
        let sendCallback = state.sendCallback;

        this.controller.setSendCallback(sendCallback);
        this.controller.setStartingCalificators(calificators);

        if(obligatory){
            this.controller.setObligatory(obligatory);
        } else{
            this.controller.setObligatory(false);
        }
        
        if(defaultGroup){
            this.controller.setDefaultGroup(defaultGroup);
        } else{
            this.controller.setDefaultGroup(0);
        }

        this.controller.start();
        this.controller.setDefaultGroup(null);
    }

    toMenuSelectionState(state){
        let group = state.group;
        let selection = state.selection;
        let sendCallback = state.sendCallback;
        this.controller.setSelection(group, selection);
        this.controller.setSendCallback(sendCallback);
    }

    toClientState(state){
        let search = state.search;
        let callback = state.callback;
        let controller = state.controller;
        this.controller.setSelectedClientCallback(callback);
        this.controller.setSearch(search);
    }

    toDemandState(state){
        let lines = state.lines;
        let callback = state.sendCallback;
        let title = state.title;
        let hiddenButtons = state.hiddenButtons;
        let checkErrorCallback = state.checkErrorCallback;
        let emptyAllowed = state.hasOwnProperty("emptyAllowed")?state.emptyAllowed:false;
        this.rootPanel.setTitle(title);
        this.controller.setLines(lines);
        this.controller.setSendCallback(callback);
        this.controller.setCheckErrorCallback(checkErrorCallback);
        this.controller.setEmptyAllowed(emptyAllowed);
        if(hiddenButtons){
            this.hideButtons(hiddenButtons);
        }
    }

    toSaleClosingState(state, backward){
        if(backward){
            this.controller.resetButtons();
        } else{
            this.controller.reset();
        } 
    }
}

Navigator.StateOperator = 1;
Navigator.StatePlace = 2;
Navigator.StateFamily = 3;
Navigator.StateProduct = 4;
Navigator.StateCombinedProduct = 5;
Navigator.StateTicket = 6;
Navigator.StateFastFood = 7;
Navigator.StateMenu = 8;
Navigator.StateCalificator = 9;
Navigator.StateMenuSelection = 10;
Navigator.StateClient = 11;
Navigator.StateDemand = 12;
Navigator.StateSaleClosing = 13;

export default Navigator;