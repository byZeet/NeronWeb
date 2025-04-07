import SaleClosingDinnerView from "./SaleClosingDinnerView.js";
import SaleClosingLineView from "./SaleClosingLineView.js";

const saleClosingPanelTemplate = document.getElementById("sale-closing-panel-template").innerHTML;


class SaleClosingPanel{

    constructor(){
        this.dom = $(saleClosingPanelTemplate);
        this.wrapper = this.dom.find(".sale-closing-wrapper");
        this.paymentWay = this.dom.find(".payment-way");
        this.paymentWay.click(()=>{
            this.controller.paymentWayTouch(1);
        });
        this.firstPaymentWay = this.dom.find(".first-payment-way");
        this.firstPaymentWay.click(()=>{
            this.controller.paymentWayTouch(1);
        });
        this.secondPaymentWay = this.dom.find(".second-payment-way");
        this.secondPaymentWay.click(()=>{
            this.controller.paymentWayTouch(2);
        });

        this.total = this.dom.find(".total");

        this.firstPrice = this.dom.find(".first-price");
        this.firstPrice.click(()=>{
            this.controller.priceTouch(1);
        });
        this.secondPrice = this.dom.find(".second-price");
        this.secondPrice.click(()=>{
            this.controller.priceTouch(2);
        });
        this.documentType = this.dom.find(".document-type");
        this.documentType.click(()=>{
            this.controller.documentTypeTouch();
        });
        this.dinners = this.dom.find(".dinners");
        this.dinners.click(()=>{
            this.controller.dinnersTouch();
        });
        this.client= this.dom.find(".client");
        this.client.click(()=>{
            this.controller.clientTouch();
        });
        this.receverQr= this.dom.find(".recever-qr");
        this.receverQr.click(()=>{
            this.controller.receverQrTouch();
        });
        this.discount= this.dom.find(".discount");
        this.discount.click(()=>{
            this.controller.discountTouch();
        });
        this.modifier= this.dom.find(".printing-modifier");
        this.modifier.click(()=>{
            this.controller.modifiersTouch();
        });
        this.tin = this.dom.find(".tin");
        this.tin.click(()=>{
            this.controller.tinTouch();
        });
        this.lines = this.dom.find(".lines");
        this.lines.click(()=>{
            this.controller.linesTouch();
        });
        this.clients = this.dom.find(".clients");
    }

    hideTin(flag){
        if(flag){
            this.dom.find(".tin-wrapper").addClass("hidden");
        }
    }

    setHasRecever(flag){
        if(flag){
            return;
        }
        this.dom.find(".recever-qr-wrapper").addClass("hidden");
    }
     

    setDinnerController(controller){
        this.dinnerController = controller;
    }

    setController(controller){
        this.controller = controller;
    }

    setTotal(total){
        this.total.text(total.toFixed(2)+" €");
    }

    setPaymentWay(paymentWay){
        this.paymentWay.text(paymentWay);
    }

    setFirstPaymentWay(paymentWay){
        this.firstPaymentWay.text(paymentWay);
    }

    setSecondPaymentWay(paymentWay){
        this.secondPaymentWay.text(paymentWay);
    }

    setFirstPrice(price){
        this.firstPrice.text(price.toFixed(2)+" €");
    }

    setSecondPrice(price){
        this.secondPrice.text(price.toFixed(2)+" €");
    }

    setTin(tin){
        this.tin.text(tin.toFixed(2)+" €");
    }

    setDocumentType(documentType){
        this.documentType.text(documentType);
    }

    setDinners(dinners){
        this.dinners.text(dinners);
    }

    setDiscount(discount){
        this.discount.text(discount+"%");
    }

    setClient(client){
        if(client==null){
            this.client.text("Sin cliente");
        } else{
            this.client.text(client.name);
        }
    }

    setReceverQr(qr){
        this.receverQr.text(qr);
    }

    setPayments(payments){
        if(payments==1){
            this.wrapper.removeClass("two-payment-ways");
        } else{
            this.wrapper.addClass("two-payment-ways");
        }
    }

    setModifier(modifier, quantity){
        if(modifier==null){
            this.modifier.text("Ninguno");
        } else{
            this.modifier.text("("+quantity+") "+modifier.description);
        }
    }

    setLineSelections(selections){
        this.lines.html("");
        if(selections==null){
            this.dom.find(".lines-wrapper").addClass("hidden");
            return;
        }
        this.dom.find(".lines-wrapper").removeClass("hidden");
        for(let selection of selections){
            let lineView = new SaleClosingLineView(selection);
            this.lines.append(lineView.dom);
        }
    }

    setClients(clients){
        if(clients==null){
            this.wrapper.removeClass("multiple");
            return;
        }
        this.wrapper.addClass("multiple");
        this.clients.html("");
        for(let client of clients){
            let dinnerView = new SaleClosingDinnerView(client);
            dinnerView.setController(this.dinnerController);
            this.clients.append(dinnerView.dom);
        }
    }

}

export default SaleClosingPanel;