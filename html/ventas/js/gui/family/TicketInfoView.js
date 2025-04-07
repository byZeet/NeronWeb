import Constants from "../../app/Constants.js";

class TicketInfoView{

    constructor(dom){
        this.dom = dom;
        this.placeName = this.dom.find(".place-name");
        this.tableName = this.dom.find(".table-name");
        this.totalPrice = this.dom.find(".total-price");
        this.bottomInfo = this.dom.find(".bottom-info");
        this.quantity = this.dom.find(".product-quantity");
        this.description = this.dom.find(".product-description");
        this.price = this.dom.find(".product-price");
    }

    changeTable(table){
        this.placeName.text(table.place.name);
        this.tableName.text(table.description);
        this.setTotal(table.total);
        let lines = table.getLines();
        if(lines.length>0){
            let lastLine = lines[lines.length-1];
            this.setLastLine(lastLine);
        } else{
            this.setLastLine(null);
        }
    }

    //Updates
    setTotal(total){
        this.totalPrice.text(total.toFixed(2));
    }

    setLastLine(line){
        if(this.lastLine){
            this.lastLine.getObservable().removeObserver(this);
        }
        this.lastLine = line;
        if(line==null){
            this.bottomInfo.addClass("hidden");
            return;
        }
        line.getObservable().addObserver(this);
        //flex
        this.bottomInfo.removeClass("hidden");
        if(line.type == Constants.TYPE_KITCHEN_NOTICE){
            this.dom.addClass("kitchen-notice");
        } else{
            this.dom.removeClass("kitchen-notice");
        }
        if(line.hasOwnProperty("quantity")){
            this.setQuantity(line.quantity);
            this.setDescription(line.showDescription);
            this.setPrice(line.price);
        }
    }

    setPrice(price){
        this.price.text(price.toFixed(2));
    }

    setQuantity(quantity){
        this.quantity.text(quantity);
    }

    setDescription(description){
        this.description.text(description);
    }


}

export default TicketInfoView;