const saleClosingDinnerViewTemplate = document.getElementById("sale-closing-dinner-view-template").innerHTML;

class SaleClosingDinnerView{

    constructor(dinner){
        this.dom = $(saleClosingDinnerViewTemplate);
        this.clientName = this.dom.find(".dinner-client-name");
        this.clientName.click(()=>{
            this.controller.clientTouch(dinner);
        });
        this.total = this.dom.find(".dinner-total");
        this.total.click(()=>{
            this.controller.totalTouch(dinner);
        });
        this.modifier = this.dom.find(".dinner-modifier");
        this.modifier.click(()=>{
            this.controller.modifierSelectionTouch(dinner);
        });
        this.paymentWay = this.dom.find(".dinner-payment-way");
        this.paymentWay.click(()=>{
            this.controller.paymentWayTouch(dinner);
        });
        this.setClient(dinner.client);
        this.setPaymentWay(dinner.paymentWay);
        this.setModifierSelection(dinner.modifierSelection);
        this.setTotal(dinner.total);
        dinner.getObservable().addObserver(this);
    }

    setController(controller){
        this.controller = controller;
    }

    setClient(client){
        if(client==null){
            this.clientName.removeClass("with-client");
            this.clientName.text("Sin cliente");
        } else{
            this.clientName.addClass("with-client");
            this.clientName.text(client.name);
        }
    }

    setTotal(total){
        this.total.text(total.toFixed(2)+"€");
    }

    setModifierSelection(selection){
        if(selection.modifier == null){
            this.modifier.removeClass("with-modifier");
            this.modifier.text("Sin modificador");
        } else{
            this.modifier.addClass("with-modifier");
            this.modifier.text("("+selection.quantity+") "+selection.modifier.description);
        }
    }

    setPaymentWay(paymentWay){
        this.paymentWay.text(paymentWay.description);
    }

    
}

export default SaleClosingDinnerView;