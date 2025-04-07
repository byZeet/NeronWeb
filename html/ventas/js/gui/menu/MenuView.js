import GlobalParameters from "../../app/GlobalParameters.js"

const menuViewTemplate = document.getElementById("menu-view-template").innerHTML;

class MenuView{

    constructor(controller, product, group){
        this.controller = controller;
        this.dom = $(menuViewTemplate);
        this.quantityLabel = this.dom.find(".quantity");
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
        this.dom.css({backgroundColor: "#"+product.backgroundColor});
        this.dom.find(".product-description").css({color:"#"+product.textColor});
        this.dom.click(()=>{
            this.controller.productTouch(product, group);
        });
        this.dom.find(".product-stock").text(product.currentStock);
        if(GlobalParameters.DAY_STOCK_CONTROL && product.hasDayStock){
            this.dom.addClass("has-stock");
        }
    } 

    setQuantity(quantity){
        if(quantity==0){
            this.dom.removeClass("selected");
        } else{
            this.dom.addClass("selected");
            this.quantityLabel.text(quantity);
        }
    }
}

export default MenuView;


