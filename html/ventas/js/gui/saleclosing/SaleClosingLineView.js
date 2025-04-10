import MathUtil from "../../../../lib/util/MathUtil.js";

const saleClosingLineViewTemplate = document.getElementById("sale-closing-line-view-template").innerHTML;


class SaleClosingLineView{

    constructor(selection){
        this.dom = $(saleClosingLineViewTemplate);
        this.quantity = this.dom.find(".line-quantity");
        this.description = this.dom.find(".line-description");
        this.price = this.dom.find(".line-price");
        this.setQuantity(selection.selectedQuantity);
        this.setDescription(selection.line.showDescription);
        this.setPrice(selection.selectedPrice);
    }

    setQuantity(quantity){
        this.quantity.text(quantity);
    }

    setDescription(description){
        this.description.text(description);
    }

    setPrice(price){
        this.price.text(price.toFixed(2));
    }

    
}

export default SaleClosingLineView;