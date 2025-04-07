import Constants from "../../app/Constants.js";

class ProductBasicModel{
    constructor(extra){
        this.quantity = extra.Q;
        this.optional = !extra.hasOwnProperty("O");
        this.type = Constants.INGREDIENT_TYPE_BASIC;
    }

    setProduct(product){
        this.id = product.id;
        this.product = product;
    }

    isBasic(){
        return true;
    }
}

export default ProductBasicModel;