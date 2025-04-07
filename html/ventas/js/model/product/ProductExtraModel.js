import Constants from "../../app/Constants.js";

class ProductExtraModel{
    constructor(extra){
        this.freeTimes = extra.FN;
        this.price = extra.P
        this.free = this.price == 0;
        this.maxQuantity = extra.MaxQ;
        this.askQuantity = this.maxQuantity > 1;
        this.type = Constants.INGREDIENT_TYPE_EXTRA;
        this.subgroupId = extra.Sub;
    }

    setProduct(product){
        if(!product){
            return;
        }
        this.id = product.id;
        this.product = product;
    }

    isBasic(){
        return false;
    }
    
}

export default ProductExtraModel;