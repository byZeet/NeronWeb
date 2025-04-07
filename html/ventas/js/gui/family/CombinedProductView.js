import ProductView from "./ProductView.js";

class CombinedProductView extends ProductView{
    constructor(app, product){
       super(app, product);
       this.description.firstChild.nodeValue = product.sodaDescription;
    } 
}

export default CombinedProductView;