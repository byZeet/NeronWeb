import Navigator from "../../app/Navigator.js";

class SaleClosingDinnerController{

    constructor(){

    }

    setNavigator(navigator){
        this.navigator = navigator;
    }

    setModalController(controller){
        this.modalController = controller;
    }

    setSelectModal(modal){
        this.selectModal = modal;
    }

    setPaymentWays(paymentWays){
        this.paymentWays = paymentWays;
    }

    setModifiers(modifiers){
        this.modifiers = modifiers;
    }

    setTotal(total){
        this.total = total;
    }

    setDinners(dinners){
        this.dinners = dinners;
    }

    clientTouch(dinner){
        this.navigator.navigateTo({
            type: Navigator.StateClient,
            search: "",
            callback: (client)=>{
                dinner.setClient(client);
            }
        });
    }

    totalTouch(dinner){
        this.modalController.askPriceInput(
            "Introduciendo importe",
            "Importe:",
            "",
            (total) => {
                this.setDinnerTotal(dinner, total);
            }
        );
    }

    setDinnerTotal(dinner, total){
        if(total>this.total){
            total = this.total;
        }
        let dinners = this.dinners;
        let totalLeft = total-dinner.total;
        for(let i = dinners.length - 1; i >= 0; i--){
            let currentDinner = dinners[i];
            if(dinner == currentDinner){
                continue;
            }
            let dinnerTotal = currentDinner.total;
            if(dinnerTotal >= totalLeft){
                currentDinner.setTotal(dinnerTotal-totalLeft);
                break;
            } else{
                currentDinner.setTotal(0);
                totalLeft-=dinnerTotal;
            }
        }
        dinner.setTotal(total);
    }

    modifierSelectionTouch(dinner){
        let options = [{
            id: 0,
            description: "Sin modificador"
        }];
        for(let modifier of this.modifiers.values()){
            options.push({
                id: modifier.id,
                description: modifier.description
            });
        }
        this.selectModal.setTitle("Seleccionando modificador");
        this.selectModal.setOptions(options);
        this.selectModal.setCallback((id)=>{
            if(id==0){
                dinner.setModifierSelection({
                    modifier: null,
                    quantity: 0
                });
                return;
            }
            this.modalController.askIntegerInput(
                "Introduciendo cantidad",
                "Cantidad:",
                "",
                (quantity) => {
                    let modifier = this.modifiers.get(id);
                    dinner.setModifierSelection({
                        modifier: modifier,
                        quantity: quantity
                    });
                }
            );
        });
        if(dinner.modifierSelection.modifier){
            this.selectModal.select(dinner.modifierSelection.modifier.id);
        } else{
            this.selectModal.select(0);
        }
        this.selectModal.show();
    }

    paymentWayTouch(dinner){
        let options = [];
        for(let paymentWay of this.paymentWays.values()){
            options.push({
                id: paymentWay.id,
                description: paymentWay.description
            });
        }
        this.selectModal.setTitle("Seleccionando forma de pago");
        this.selectModal.setOptions(options);
        this.selectModal.setCallback((id)=>{
            let paymentWay = this.paymentWays.get(id);
            this.setDinnerPaymentWay(dinner, paymentWay);
        });
        this.selectModal.select(dinner.paymentWay.id);
        this.selectModal.show();
    }

    setDinnerPaymentWay(dinner, paymentWay){
        if(dinner.client == null && paymentWay.id == "CRE"){
            this.navigator.navigateTo({
                type: Navigator.StateClient,
                search: "",
                callback: (client)=>{
                    dinner.setClient(client);
                    dinner.setPaymentWay(paymentWay);
                }
            });
            return;
        }
        dinner.setPaymentWay(paymentWay);
    }

    
}

export default SaleClosingDinnerController;