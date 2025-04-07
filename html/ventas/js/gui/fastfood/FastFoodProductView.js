import Constants from "../../app/Constants";

const fastFoodProductViewTemplate = document.getElementById("menu-view-template").innerHTML;

class FastFoodProductView{
    constructor(controller, product, type){
        this.type = type;
        this.dom = $(fastFoodProductViewTemplate);
        if(product.image){
            this.dom.addClass("with-image");
            this.dom.find(".product-image").on("error", ()=>{
                this.dom.removeClass("with-image").addClass("without-image");
            }).attr("src", "/"+product.image);
        } else{
            this.dom.addClass("without-image");
        }
        if(product.showDesc==""){
            this.dom.addClass("without-text");
        } else{
            this.dom.find(".product-description").text(product.showDesc);
        }
        if(this.type == Constants.INGREDIENT_TYPE_EXTRA){
            this.dom.addClass("extra");
        }
        this.quantity = this.dom.find(".quantity-wrapper");
        this.quantity.html("<img src='./img/dark/tick.png'>");
        this.dom.css({backgroundColor: "#"+product.backgroundColor});
        this.dom.find(".product-description").css({color:"#"+product.textColor});
        this.dom.click(()=>{
            controller.productTouch(type+"@"+product.id);
        });
    } 

    select(quantity){
        this.dom.addClass("selected");
        if(this.type == Constants.INGREDIENT_TYPE_EXTRA){
            this.quantity.text(quantity);
        }
    }

    unselect(){
        this.dom.removeClass("selected");
        if(this.type == Constants.INGREDIENT_TYPE_EXTRA){
            this.quantity.text("");
        }
    }

}

export default FastFoodProductView;


