import ProductModel from "../ProductModel.js";

class CombinedProductModel extends ProductModel{
    constructor(product, combinedDescription = null){
        super(product);
        this.type = "C";
        if(product.hasOwnProperty("T")){
            this.type = product.T;
        }
        this.secondProductId = product.S;
        if(combinedDescription==null){
            this.sodaDescription = product.So;
        } else{
            this.sodaDescription = combinedDescription;
        }
    }
}

export default CombinedProductModel;