import Observable from "../../../../lib/util/Observable.js";

class SaleClosingDinner{

    constructor(){
        this.observable = new Observable();
    }

    getObservable(){
        return this.observable;
    }

    setClient(client){
        this.client = client;
        this.observable.notify("setClient", client);
    }

    setTotal(total){
        this.total = total;
        this.observable.notify("setTotal", total);
    }

    setModifierSelection(selection){
        this.modifierSelection = selection;
        this.observable.notify("setModifierSelection", selection);
    }

    setPaymentWay(paymentWay){
        this.paymentWay = paymentWay;
        this.observable.notify("setPaymentWay", paymentWay);
    }
}

export default SaleClosingDinner;