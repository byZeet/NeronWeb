import ProductModel from "./ProductModel.js";
import ColorUtil from "lib/util/ColorUtil.js";

class FamilyModel{
    constructor(family){
        this.familyGroup = null;
        this.update(family);
    }

    update(family){
        this.id = family.Id;
        this.showDesc = family.S;
        this.products = [];
        this.subfamilies = [];
        if(family.Bg){
            this.backgroundColor = ColorUtil.getColor(family.Bg);
        } else{
            this.backgroundColor = "e8ec4f";
        }
        if(family.Co){
            this.textColor = ColorUtil.getColor(family.Co);
        } else{
            this.textColor = "000000";
        }
        this.registerOrder = family.O;
        if(family.Img){
            this.image = family.Img;
        } else{
            this.image = null;
        }
    }

    addSubfamily(subfamily){
        this.subfamilies.push(subfamily);
    }

    addProduct(product){
        this.products.push(product);
        product.setFamily(this);
    }

    hasSubfamilies(){
        return this.subfamilies && this.subfamilies.length > 0;
    }
}

export default FamilyModel;